using System;
using System.Collections.Generic;
using System.Data;
using Microsoft.Data.SqlClient;
using BookStoreReact.Server.Models;
using Microsoft.Extensions.Configuration;

namespace BookStoreReact.Server.Data
{
    public class DALBook
    {
        private readonly string _connStr;

        public DALBook(IConfiguration config)
        {
            _connStr = config.GetConnectionString("DefaultConnection");
        }

        
        // GET ALL BOOKS  (Cleaned output for Admin + Customer)
        
        public List<BookModel> GetAllBooks()
        {
            List<BookModel> list = new();

            using SqlConnection conn = new SqlConnection(_connStr);
            conn.Open();

            SqlCommand cmd = new SqlCommand(@"
                SELECT b.ISBN, b.CategoryID, b.Title, b.Author, b.Price, 
                       b.SupplierId, b.Year, b.Edition, b.Publisher, b.InStock,
                       s.Name AS SupplierName
                FROM BookData b
                LEFT JOIN Supplier s ON b.SupplierId = s.SupplierId
                ORDER BY b.ISBN;
            ", conn);

            SqlDataReader r = cmd.ExecuteReader();

            while (r.Read())
            {
                list.Add(new BookModel
                {
                    ISBN = r["ISBN"].ToString().Trim(),

                    CategoryID = Convert.ToInt32(r["CategoryID"]),

                    Title = r["Title"] == DBNull.Value ? "Untitled" : r["Title"].ToString(),

                    Author = r["Author"] == DBNull.Value ? "Unknown" : r["Author"].ToString(),

                    Price = r["Price"] == DBNull.Value ? 0 : Convert.ToDecimal(r["Price"]),

                    SupplierId = r["SupplierId"] == DBNull.Value ? null : Convert.ToInt32(r["SupplierId"]),

                    SupplierName = r["SupplierName"] == DBNull.Value ? null : r["SupplierName"].ToString(),

                    Year = r["Year"] == DBNull.Value ? null : r["Year"].ToString().Trim(),

                    Edition = r["Edition"] == DBNull.Value ? "1" : r["Edition"].ToString().Trim(),

                    Publisher = r["Publisher"] == DBNull.Value ? "Unknown" : r["Publisher"].ToString(),

                    InStock = r["InStock"] == DBNull.Value ? 0 : Convert.ToInt32(r["InStock"])
                });
            }

            return list;
        }

        
        // ADD BOOK
        
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
            cmd.Parameters.AddWithValue("@T", string.IsNullOrWhiteSpace(m.Title) ? "Untitled" : m.Title);
            cmd.Parameters.AddWithValue("@A", string.IsNullOrWhiteSpace(m.Author) ? "Unknown" : m.Author);
            cmd.Parameters.AddWithValue("@P", m.Price);
            cmd.Parameters.AddWithValue("@SID", (object?)m.SupplierId ?? DBNull.Value);
            cmd.Parameters.AddWithValue("@Y", (object?)m.Year ?? DBNull.Value);
            cmd.Parameters.AddWithValue("@E", string.IsNullOrWhiteSpace(m.Edition) ? "1" : m.Edition);
            cmd.Parameters.AddWithValue("@PUB", (object?)m.Publisher ?? DBNull.Value);
            cmd.Parameters.AddWithValue("@STK", m.InStock);

            return cmd.ExecuteNonQuery();
        }

        
        // UPDATE BOOK
        
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
            cmd.Parameters.AddWithValue("@T", string.IsNullOrWhiteSpace(m.Title) ? "Untitled" : m.Title);
            cmd.Parameters.AddWithValue("@A", string.IsNullOrWhiteSpace(m.Author) ? "Unknown" : m.Author);
            cmd.Parameters.AddWithValue("@P", m.Price);
            cmd.Parameters.AddWithValue("@SID", (object?)m.SupplierId ?? DBNull.Value);
            cmd.Parameters.AddWithValue("@Y", (object?)m.Year ?? DBNull.Value);
            cmd.Parameters.AddWithValue("@E", string.IsNullOrWhiteSpace(m.Edition) ? "1" : m.Edition);
            cmd.Parameters.AddWithValue("@PUB", (object?)m.Publisher ?? DBNull.Value);
            cmd.Parameters.AddWithValue("@STK", m.InStock);

            return cmd.ExecuteNonQuery();
        }

        
        // DELETE BOOK — SAFE DELETE WITH FK CHECK
        
        public int DeleteBook(string isbn)
        {
            using SqlConnection conn = new SqlConnection(_connStr);
            conn.Open();

            // FK Check — Prevent orphan order items
            SqlCommand checkCmd = new SqlCommand(@"
                SELECT COUNT(*) FROM OrderItems WHERE ISBN = @ISBN;
            ", conn);

            checkCmd.Parameters.AddWithValue("@ISBN", isbn);
            int count = Convert.ToInt32(checkCmd.ExecuteScalar());

            if (count > 0)
                throw new Exception("Cannot delete this book because it exists in past orders.");

            SqlCommand cmd = new SqlCommand(
                "DELETE FROM BookData WHERE ISBN=@ISBN",
                conn
            );

            cmd.Parameters.AddWithValue("@ISBN", isbn);

            return cmd.ExecuteNonQuery();
        }
    }
}
