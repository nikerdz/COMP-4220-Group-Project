using System;
using System.Collections.Generic;
using Microsoft.Data.SqlClient;
using BookStoreReact.Server.Models;
using Microsoft.Extensions.Configuration;

namespace BookStoreReact.Server.Data
{
    public class DALBook
    {
        private readonly string _connStr;

        // Supports DI and also manual new DALBook()
        public DALBook(IConfiguration? config = null)
        {
            if (config != null)
            {
                _connStr = config.GetConnectionString("DefaultConnection");
            }
            else
            {
                var builder = new ConfigurationBuilder()
                    .AddJsonFile("appsettings.json", optional: false)
                    .AddEnvironmentVariables();

                var cfg = builder.Build();
                _connStr = cfg.GetConnectionString("DefaultConnection");
            }
        }

        // GET ALL BOOKS
        public List<BookModel> GetAllBooks()
        {
            List<BookModel> list = new();

            using SqlConnection conn = new SqlConnection(_connStr);
            conn.Open();

            SqlCommand cmd = new SqlCommand(@"
                SELECT b.*, s.Name AS SupplierName
                FROM BookData b
                LEFT JOIN Supplier s ON b.SupplierId = s.SupplierId
                ORDER BY b.ISBN;
            ", conn);

            SqlDataReader r = cmd.ExecuteReader();

            while (r.Read())
            {
                list.Add(new BookModel
                {
                    ISBN = r["ISBN"].ToString(),
                    CategoryID = Convert.ToInt32(r["CategoryID"]),
                    Title = r["Title"]?.ToString(),
                    Author = r["Author"]?.ToString(),
                    Price = Convert.ToDecimal(r["Price"]),
                    SupplierId = r["SupplierId"] == DBNull.Value ? null : Convert.ToInt32(r["SupplierId"]),
                    SupplierName = r["SupplierName"]?.ToString(),
                    Year = r["Year"]?.ToString()?.Trim(),
                    Edition = r["Edition"]?.ToString()?.Trim(),
                    Publisher = r["Publisher"]?.ToString(),
                    InStock = Convert.ToInt32(r["InStock"])
                });
            }

            return list;
        }

        // ADD BOOK — return number of rows added
        public int AddBook(BookModel m)
        {
            using SqlConnection conn = new SqlConnection(_connStr);
            conn.Open();

            SqlCommand cmd = new SqlCommand(@"
                INSERT INTO BookData
                (ISBN, CategoryID, Title, Author, Price, SupplierId, Year, Edition, Publisher, InStock)
                VALUES (@ISBN, @CID, @T, @A, @P, @SID, @Y, @E, @PUB, @STK);
            ", conn);

            cmd.Parameters.AddWithValue("@ISBN", m.ISBN);
            cmd.Parameters.AddWithValue("@CID", m.CategoryID);
            cmd.Parameters.AddWithValue("@T", m.Title ?? "");
            cmd.Parameters.AddWithValue("@A", m.Author ?? "");
            cmd.Parameters.AddWithValue("@P", m.Price);
            cmd.Parameters.AddWithValue("@SID", m.SupplierId ?? (object)DBNull.Value);
            cmd.Parameters.AddWithValue("@Y", string.IsNullOrWhiteSpace(m.Year) ? (object)DBNull.Value : m.Year);
            cmd.Parameters.AddWithValue("@E", m.Edition?.PadRight(2).Substring(0, 2) ?? "");
            cmd.Parameters.AddWithValue("@PUB", m.Publisher ?? "");
            cmd.Parameters.AddWithValue("@STK", m.InStock);

            return cmd.ExecuteNonQuery();
        }

        // UPDATE BOOK — return number of rows updated
        public int UpdateBook(BookModel m)
        {
            using SqlConnection conn = new SqlConnection(_connStr);
            conn.Open();

            SqlCommand cmd = new SqlCommand(@"
                UPDATE BookData SET
                    CategoryID=@CID,
                    Title=@T,
                    Author=@A,
                    Price=@P,
                    SupplierId=@SID,
                    Year=@Y,
                    Edition=@E,
                    Publisher=@PUB,
                    InStock=@STK
                WHERE ISBN=@ISBN;
            ", conn);

            cmd.Parameters.AddWithValue("@ISBN", m.ISBN);
            cmd.Parameters.AddWithValue("@CID", m.CategoryID);
            cmd.Parameters.AddWithValue("@T", m.Title ?? "");
            cmd.Parameters.AddWithValue("@A", m.Author ?? "");
            cmd.Parameters.AddWithValue("@P", m.Price);
            cmd.Parameters.AddWithValue("@SID", m.SupplierId ?? (object)DBNull.Value);
            cmd.Parameters.AddWithValue("@Y", string.IsNullOrWhiteSpace(m.Year) ? (object)DBNull.Value : m.Year);
            cmd.Parameters.AddWithValue("@E", m.Edition?.PadRight(2).Substring(0, 2) ?? "");
            cmd.Parameters.AddWithValue("@PUB", m.Publisher ?? "");
            cmd.Parameters.AddWithValue("@STK", m.InStock);

            return cmd.ExecuteNonQuery();
        }

        // DELETE BOOK — return number of rows deleted
        public int DeleteBook(string isbn)
        {
            using SqlConnection conn = new SqlConnection(_connStr);
            conn.Open();

            SqlCommand cmd = new SqlCommand("DELETE FROM BookData WHERE ISBN=@ISBN", conn);
            cmd.Parameters.AddWithValue("@ISBN", isbn);

            return cmd.ExecuteNonQuery();
        }
    }
}
