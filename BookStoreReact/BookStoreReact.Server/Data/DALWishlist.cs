using System;
using System.Collections.Generic;
using Microsoft.Data.SqlClient;
using BookStoreReact.Server.Models;
using Microsoft.Extensions.Configuration;

namespace BookStoreReact.Server.Data
{
    public class DALWishlist
    {
        private readonly string _connStr;

        public DALWishlist(IConfiguration? config = null)
        {
            if (config != null)
                _connStr = config.GetConnectionString("DefaultConnection");
            else
            {
                var builder = new ConfigurationBuilder()
                    .AddJsonFile("appsettings.json", optional: false)
                    .AddEnvironmentVariables();
                var cfg = builder.Build();
                _connStr = cfg.GetConnectionString("DefaultConnection");
            }
        }

        public int AddToWishlist(int userId, string isbn)
        {
            using SqlConnection conn = new SqlConnection(_connStr);
            conn.Open();

            SqlCommand cmd = new SqlCommand(@"
                INSERT INTO Wishlist (UserID, ISBN)
                VALUES (@UID, @ISBN);
            ", conn);

            cmd.Parameters.AddWithValue("@UID", userId);
            cmd.Parameters.AddWithValue("@ISBN", isbn);

            try
            {
                return cmd.ExecuteNonQuery();
            }
            catch
            {
                return -1; // duplicate or fail
            }
        }

        public int RemoveFromWishlist(int userId, string isbn)
        {
            using SqlConnection conn = new SqlConnection(_connStr);
            conn.Open();

            SqlCommand cmd = new SqlCommand(@"
                DELETE FROM Wishlist WHERE UserID=@UID AND ISBN=@ISBN;
            ", conn);

            cmd.Parameters.AddWithValue("@UID", userId);
            cmd.Parameters.AddWithValue("@ISBN", isbn);

            return cmd.ExecuteNonQuery();
        }

        // ??? CHANGE IS HERE
        public List<WishlistModel> GetWishlist(int userId)
        {
            List<WishlistModel> list = new();

            using SqlConnection conn = new SqlConnection(_connStr);
            conn.Open();

            SqlCommand cmd = new SqlCommand(@"
                SELECT 
                    w.WishlistID,
                    w.UserID,
                    w.ISBN,
                    w.DateAdded,
                    b.Title,
                    b.Author,
                    b.Price
                FROM Wishlist w
                INNER JOIN BookData b ON w.ISBN = b.ISBN
                WHERE w.UserID = @UID
                ORDER BY w.DateAdded DESC;
            ", conn);

            cmd.Parameters.AddWithValue("@UID", userId);

            SqlDataReader r = cmd.ExecuteReader();

            while (r.Read())
            {
                list.Add(new WishlistModel
                {
                    WishlistID = Convert.ToInt32(r["WishlistID"]),
                    UserID = Convert.ToInt32(r["UserID"]),
                    ISBN = r["ISBN"].ToString(),
                    DateAdded = Convert.ToDateTime(r["DateAdded"]),
                    Title = r["Title"].ToString(),
                    Author = r["Author"].ToString(),
                    Price = Convert.ToDecimal(r["Price"])
                });
            }

            return list;
        }
    }
}
