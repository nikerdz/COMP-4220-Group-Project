using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;

namespace BookStoreLIB
{
    public class WishlistDAL
    {
        // -------------------- Connection resolution --------------------
        public static string ResolveConn()
        {
            // Mirror DALUserInfo.ResolveConn() behavior
            var user = Environment.GetEnvironmentVariable("AGILE_DB_USER");
            var pass = Environment.GetEnvironmentVariable("AGILE_DB_PASSWORD");
            var server = Environment.GetEnvironmentVariable("AGILE_DB_SERVER") ?? "tfs.cs.uwindsor.ca";
            var db = Environment.GetEnvironmentVariable("AGILE_DB_NAME") ?? "Agile1422DB25";

            if (string.IsNullOrWhiteSpace(user) || string.IsNullOrWhiteSpace(pass))
                throw new InvalidOperationException("Missing AGILE_DB_USER/AGILE_DB_PASSWORD.");

            var cs = new SqlConnectionStringBuilder
            {
                DataSource = server,
                InitialCatalog = db,
                PersistSecurityInfo = true,
                UserID = user,
                Password = pass,
                Encrypt = true,
                TrustServerCertificate = true
            };

            return cs.ConnectionString;
        }

        // -------------------- Internal helpers --------------------

        private static int GetOrCreateUserId(SqlConnection conn, string username)
        {
            if (string.IsNullOrWhiteSpace(username))
                throw new ArgumentException("Username is required.", nameof(username));

            // Try get existing
            using (var cmd = new SqlCommand(
                "SELECT TOP 1 UserID FROM dbo.UserData WHERE UserName=@UserName", conn))
            {
                cmd.Parameters.Add("@UserName", SqlDbType.VarChar, 20).Value = username;
                var obj = cmd.ExecuteScalar();
                if (obj != null && obj != DBNull.Value)
                    return Convert.ToInt32(obj);
            }

            // Create a minimal user row (let trigger assign UserID)
            using (var cmdIns = new SqlCommand(
                "INSERT INTO dbo.UserData (FullName, UserName, [Password], [Type], Manager) " +
                "VALUES (@FullName, @UserName, @Password, 'CU', 0); " +
                "SELECT CAST(SCOPE_IDENTITY() AS INT);", conn))
            {
                cmdIns.Parameters.Add("@FullName", SqlDbType.NVarChar, 50).Value = DBNull.Value;
                cmdIns.Parameters.Add("@UserName", SqlDbType.VarChar, 20).Value = username;
                cmdIns.Parameters.Add("@Password", SqlDbType.VarChar, 25).Value = "***";

                var scalar = cmdIns.ExecuteScalar();
                return Convert.ToInt32(scalar);
            }
        }

        private static int? TryGetUserId(SqlConnection conn, string username)
        {
            using (var cmd = new SqlCommand(
                "SELECT TOP 1 UserID FROM dbo.UserData WHERE UserName=@UserName", conn))
            {
                cmd.Parameters.Add("@UserName", SqlDbType.VarChar, 20).Value = username ?? "";
                var obj = cmd.ExecuteScalar();
                if (obj == null || obj == DBNull.Value) return null;
                return Convert.ToInt32(obj);
            }
        }

        // -------------------- Public API --------------------

        public static void SafeDeleteWishlist(string username)
        {
            if (string.IsNullOrWhiteSpace(username)) return;

            using (var conn = new SqlConnection(ResolveConn()))
            {
                conn.Open();
                int? userId = TryGetUserId(conn, username);
                if (userId == null) return;

                using (var cmd = new SqlCommand(
                    "DELETE FROM dbo.Wishlist WHERE UserID=@UserID", conn))
                {
                    cmd.Parameters.Add("@UserID", SqlDbType.Int).Value = userId.Value;
                    cmd.ExecuteNonQuery();
                }
            }
        }
        public static void SaveWishlist(string username, Wishlist wishlist)
        {
            if (wishlist == null) throw new ArgumentNullException(nameof(wishlist));
            if (string.IsNullOrWhiteSpace(username))
                throw new ArgumentException("Username is required.", nameof(username));

            using (var conn = new SqlConnection(ResolveConn()))
            {
                conn.Open();

                // Ensure we have a UserID (create minimal user if needed)
                int userId = GetOrCreateUserId(conn, username);

                // Clear existing wishlist rows
                using (var del = new SqlCommand(
                    "DELETE FROM dbo.Wishlist WHERE UserID=@UserID", conn))
                {
                    del.Parameters.Add("@UserID", SqlDbType.Int).Value = userId;
                    del.ExecuteNonQuery();
                }

                // Insert current wishlist
                if (wishlist.wishlistBooks == null || wishlist.wishlistBooks.Count == 0)
                    return;

                foreach (var book in wishlist.wishlistBooks)
                {
                    if (book == null || string.IsNullOrWhiteSpace(book.ISBN))
                        continue;

                    using (var ins = new SqlCommand(
                        "INSERT INTO dbo.Wishlist (UserID, ISBN) VALUES (@UserID, @ISBN)", conn))
                    {
                        ins.Parameters.Add("@UserID", SqlDbType.Int).Value = userId;
                        ins.Parameters.Add("@ISBN", SqlDbType.Char, 10).Value = book.ISBN;

                        try
                        {
                            ins.ExecuteNonQuery();
                        }
                        catch (SqlException ex)
                        {
                            // Ignore unique violations (already present) just in case
                            if (ex.Number != 2627 && ex.Number != 2601)
                                throw;
                        }
                    }
                }
            }
        }

        public static Wishlist LoadWishlist(string username)
        {
            var wishlist = new Wishlist();

            if (string.IsNullOrWhiteSpace(username))
                return wishlist;

            using (var conn = new SqlConnection(ResolveConn()))
            {
                conn.Open();

                int? userId = TryGetUserId(conn, username);
                if (userId == null) return wishlist;

                // Pull wishlist items; we join BookData to populate Title/Price when available
                using (var cmd = new SqlCommand(
                    @"SELECT b.ISBN, b.Title, b.Price
                      FROM dbo.Wishlist w
                      JOIN dbo.BookData b ON b.ISBN = w.ISBN
                      WHERE w.UserID = @UserID
                      ORDER BY w.DateAdded", conn))
                {
                    cmd.Parameters.Add("@UserID", SqlDbType.Int).Value = userId.Value;

                    using (var rdr = cmd.ExecuteReader())
                    {
                        while (rdr.Read())
                        {
                            string isbn = rdr.GetString(0).Trim();

                            string title = null;
                            if (!rdr.IsDBNull(1))
                                title = rdr.GetString(1);

                            decimal price = 0m;
                            if (!rdr.IsDBNull(2))
                                price = rdr.GetDecimal(2);

                            var book = new Book
                            {
                                ISBN = isbn,
                                Title = title,
                                Price = price
                            };

                            wishlist.AddToWishlist(book);
                        }
                    }
                }
            }

            return wishlist;
        }
    }
}
