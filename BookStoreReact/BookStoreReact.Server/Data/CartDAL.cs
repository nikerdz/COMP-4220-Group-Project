using System;
using System.Collections.Generic;
using System.Data;
using Microsoft.Data.SqlClient;
using BookStoreReact.Server.Models;

namespace BookStoreReact.Server.Data
{
    public class CartDAL
    {
        public static string ResolveConn()
        {
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

        public static bool AddItemToCart(int userId, string isbn, int quantity = 1)
        {
            if (quantity <= 0) return false;

            using (var conn = new SqlConnection(ResolveConn()))
            {
                conn.Open();

                // Check if item already exists in cart
                var checkSql = "SELECT CartID, Quantity FROM dbo.Cart WHERE UserID = @UserID AND ISBN = @ISBN";
                
                using (var checkCmd = new SqlCommand(checkSql, conn))
                {
                    checkCmd.Parameters.Add("@UserID", SqlDbType.Int).Value = userId;
                    checkCmd.Parameters.Add("@ISBN", SqlDbType.Char, 10).Value = isbn;
                    
                    using (var reader = checkCmd.ExecuteReader())
                    {
                        if (reader.Read())
                        {
                            // Item exists, update quantity
                            int cartId = reader.GetInt32(0);
                            int currentQty = reader.GetInt32(1);
                            reader.Close();

                            int newQty = currentQty + quantity;
                            decimal price = GetBookPrice(isbn);
                            decimal newSubtotal = price * newQty;

                            var updateSql = "UPDATE dbo.Cart SET Quantity = @Quantity, Subtotal = @Subtotal WHERE CartID = @CartID";
                            using (var updateCmd = new SqlCommand(updateSql, conn))
                            {
                                updateCmd.Parameters.Add("@Quantity", SqlDbType.Int).Value = newQty;
                                updateCmd.Parameters.Add("@Subtotal", SqlDbType.Decimal).Value = newSubtotal;
                                updateCmd.Parameters.Add("@CartID", SqlDbType.Int).Value = cartId;
                                
                                return updateCmd.ExecuteNonQuery() > 0;
                            }
                        }
                    }
                }

                // Item doesn't exist, insert new row
                decimal bookPrice = GetBookPrice(isbn);
                decimal subtotal = bookPrice * quantity;

                var insertSql = "INSERT INTO dbo.Cart (UserID, ISBN, Quantity, Subtotal) VALUES (@UserID, @ISBN, @Quantity, @Subtotal)";
                using (var insertCmd = new SqlCommand(insertSql, conn))
                {
                    insertCmd.Parameters.Add("@UserID", SqlDbType.Int).Value = userId;
                    insertCmd.Parameters.Add("@ISBN", SqlDbType.Char, 10).Value = isbn;
                    insertCmd.Parameters.Add("@Quantity", SqlDbType.Int).Value = quantity;
                    insertCmd.Parameters.Add("@Subtotal", SqlDbType.Decimal).Value = subtotal;

                    return insertCmd.ExecuteNonQuery() > 0;
                }
            }
        }

        public static bool RemoveItemFromCart(int userId, string isbn, int quantityToRemove = 1)
        {
            if (quantityToRemove <= 0) return false;

            using (var conn = new SqlConnection(ResolveConn()))
            {
                conn.Open();

                // Get current quantity
                var checkSql = "SELECT CartID, Quantity FROM dbo.Cart WHERE UserID = @UserID AND ISBN = @ISBN";
                
                using (var checkCmd = new SqlCommand(checkSql, conn))
                {
                    checkCmd.Parameters.Add("@UserID", SqlDbType.Int).Value = userId;
                    checkCmd.Parameters.Add("@ISBN", SqlDbType.Char, 10).Value = isbn;
                    
                    using (var reader = checkCmd.ExecuteReader())
                    {
                        if (reader.Read())
                        {
                            int cartId = reader.GetInt32(0);
                            int currentQty = reader.GetInt32(1);
                            reader.Close();

                            int newQty = currentQty - quantityToRemove;

                            if (newQty <= 0)
                            {
                                // Delete the item
                                var deleteSql = "DELETE FROM dbo.Cart WHERE CartID = @CartID";
                                using (var deleteCmd = new SqlCommand(deleteSql, conn))
                                {
                                    deleteCmd.Parameters.Add("@CartID", SqlDbType.Int).Value = cartId;
                                    return deleteCmd.ExecuteNonQuery() > 0;
                                }
                            }
                            else
                            {
                                // Update quantity
                                decimal price = GetBookPrice(isbn);
                                decimal newSubtotal = price * newQty;

                                var updateSql = "UPDATE dbo.Cart SET Quantity = @Quantity, Subtotal = @Subtotal WHERE CartID = @CartID";
                                using (var updateCmd = new SqlCommand(updateSql, conn))
                                {
                                    updateCmd.Parameters.Add("@Quantity", SqlDbType.Int).Value = newQty;
                                    updateCmd.Parameters.Add("@Subtotal", SqlDbType.Decimal).Value = newSubtotal;
                                    updateCmd.Parameters.Add("@CartID", SqlDbType.Int).Value = cartId;
                                    
                                    return updateCmd.ExecuteNonQuery() > 0;
                                }
                            }
                        }
                    }
                }

                return false; // Item not found
            }
        }

        public static bool UpdateCartItemQuantity(int userId, string isbn, int newQuantity)
        {
            if (newQuantity < 0) return false;

            using (var conn = new SqlConnection(ResolveConn()))
            {
                conn.Open();

                if (newQuantity == 0)
                {
                    // Delete the item
                    var deleteSql = "DELETE FROM dbo.Cart WHERE UserID = @UserID AND ISBN = @ISBN";
                    using (var deleteCmd = new SqlCommand(deleteSql, conn))
                    {
                        deleteCmd.Parameters.Add("@UserID", SqlDbType.Int).Value = userId;
                        deleteCmd.Parameters.Add("@ISBN", SqlDbType.Char, 10).Value = isbn;
                        return deleteCmd.ExecuteNonQuery() > 0;
                    }
                }
                else
                {
                    // Update quantity and subtotal
                    decimal price = GetBookPrice(isbn);
                    decimal newSubtotal = price * newQuantity;

                    var updateSql = "UPDATE dbo.Cart SET Quantity = @Quantity, Subtotal = @Subtotal WHERE UserID = @UserID AND ISBN = @ISBN";
                    using (var updateCmd = new SqlCommand(updateSql, conn))
                    {
                        updateCmd.Parameters.Add("@Quantity", SqlDbType.Int).Value = newQuantity;
                        updateCmd.Parameters.Add("@Subtotal", SqlDbType.Decimal).Value = newSubtotal;
                        updateCmd.Parameters.Add("@UserID", SqlDbType.Int).Value = userId;
                        updateCmd.Parameters.Add("@ISBN", SqlDbType.Char, 10).Value = isbn;
                        
                        return updateCmd.ExecuteNonQuery() > 0;
                    }
                }
            }
        }

        public static List<Book> GetCartItems(int userId)
        {
            var cartItems = new List<Book>();

            using (var conn = new SqlConnection(ResolveConn()))
            {
                conn.Open();

                var sql = @"
                    SELECT c.ISBN, c.Quantity, c.Subtotal, 
                           b.Title, b.Author, b.Price, b.CategoryID, b.SupplierId, 
                           b.Year, b.Edition, b.Publisher, b.InStock
                    FROM dbo.Cart c
                    INNER JOIN dbo.BookData b ON c.ISBN = b.ISBN
                    WHERE c.UserID = @UserID";

                using (var cmd = new SqlCommand(sql, conn))
                {
                    cmd.Parameters.Add("@UserID", SqlDbType.Int).Value = userId;

                    using (var reader = cmd.ExecuteReader())
                    {
                        while (reader.Read())
                        {
                            var book = new Book
                            {
                                ISBN = reader.GetString(0).Trim(),
                                Quantity = reader.GetInt32(1),
                                Subtotal = reader.IsDBNull(2) ? 0 : reader.GetDecimal(2),
                                Title = reader.IsDBNull(3) ? "" : reader.GetString(3),
                                Author = reader.IsDBNull(4) ? "" : reader.GetString(4),
                                Price = reader.IsDBNull(5) ? 0 : reader.GetDecimal(5),
                                CategoryID = reader.IsDBNull(6) ? 0 : reader.GetInt32(6),
                                SupplierId = reader.IsDBNull(7) ? 0 : reader.GetInt32(7),
                                Year = reader.IsDBNull(8) ? "" : reader.GetString(8).Trim(),
                                Edition = reader.IsDBNull(9) ? "" : reader.GetString(9).Trim(),
                                Publisher = reader.IsDBNull(10) ? "" : reader.GetString(10),
                                InStock = reader.IsDBNull(11) ? 0 : reader.GetInt32(11)
                            };

                            cartItems.Add(book);
                        }
                    }
                }
            }

            return cartItems;
        }

        public static bool ClearCart(int userId)
        {
            using (var conn = new SqlConnection(ResolveConn()))
            {
                conn.Open();

                var sql = "DELETE FROM dbo.Cart WHERE UserID = @UserID";
                using (var cmd = new SqlCommand(sql, conn))
                {
                    cmd.Parameters.Add("@UserID", SqlDbType.Int).Value = userId;
                    cmd.ExecuteNonQuery(); // Returns number of rows deleted, but we return true regardless
                    return true;
                }
            }
        }

        public static decimal GetCartSubtotal(int userId)
        {
            using (var conn = new SqlConnection(ResolveConn()))
            {
                conn.Open();

                var sql = "SELECT SUM(Subtotal) FROM dbo.Cart WHERE UserID = @UserID";
                using (var cmd = new SqlCommand(sql, conn))
                {
                    cmd.Parameters.Add("@UserID", SqlDbType.Int).Value = userId;
                    object result = cmd.ExecuteScalar();
                    
                    if (result != null && result != DBNull.Value)
                    {
                        return Convert.ToDecimal(result);
                    }
                    return 0;
                }
            }
        }

        private static decimal GetBookPrice(string isbn)
        {
            using (var conn = new SqlConnection(ResolveConn()))
            {
                conn.Open();
                var sql = "SELECT Price FROM dbo.BookData WHERE ISBN = @ISBN";
                using (var cmd = new SqlCommand(sql, conn))
                {
                    cmd.Parameters.Add("@ISBN", SqlDbType.Char, 10).Value = isbn;
                    object result = cmd.ExecuteScalar();
                    if (result != null && result != DBNull.Value)
                    {
                        return Convert.ToDecimal(result);
                    }
                    return 0;
                }
            }
        }
    }
}
