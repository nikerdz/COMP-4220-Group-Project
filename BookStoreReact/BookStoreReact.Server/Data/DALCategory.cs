using System;
using System.Collections.Generic;
using Microsoft.Data.SqlClient;
using System.Data.SqlClient;
using System.Data;
using BookStoreReact.Server.Models;

namespace BookStoreReact.Server.Data
{
    public class DALCategory
    {
        private readonly string _connStr;

        public DALCategory(IConfiguration config)
        {
            _connStr = config.GetConnectionString("DefaultConnection");
        }

        public List<CategoryModel> GetAll()
        {
            List<CategoryModel> list = new();

            using SqlConnection conn = new SqlConnection(_connStr);
            conn.Open();

            SqlCommand cmd = new SqlCommand("SELECT * FROM Category ORDER BY CategoryID", conn);
            SqlDataReader r = cmd.ExecuteReader();

            while (r.Read())
            {
                list.Add(new CategoryModel
                {
                    CategoryID = Convert.ToInt32(r["CategoryID"]),
                    Name = r["Name"]?.ToString(),
                    Description = r["Description"]?.ToString()
                });
            }

            return list;
        }

        public int Add(CategoryModel m)
        {
            using SqlConnection conn = new SqlConnection(_connStr);
            conn.Open();

            SqlCommand cmd = new SqlCommand(
                @"INSERT INTO Category (CategoryID, Name, Description)
                  VALUES (@ID, @N, @D)", conn);

            cmd.Parameters.Add("@ID", SqlDbType.Int).Value = m.CategoryID;
            cmd.Parameters.Add("@N", SqlDbType.VarChar, 80).Value = m.Name ?? (object)DBNull.Value;
            cmd.Parameters.Add("@D", SqlDbType.VarChar, 255).Value = m.Description ?? (object)DBNull.Value;

            return cmd.ExecuteNonQuery();
        }

        public int Update(CategoryModel m)
        {
            using SqlConnection conn = new SqlConnection(_connStr);
            conn.Open();

            SqlCommand cmd = new SqlCommand(
                @"UPDATE Category
                  SET Name=@N, Description=@D
                  WHERE CategoryID=@ID", conn);

            cmd.Parameters.Add("@ID", SqlDbType.Int).Value = m.CategoryID;
            cmd.Parameters.Add("@N", SqlDbType.VarChar, 80).Value = m.Name ?? (object)DBNull.Value;
            cmd.Parameters.Add("@D", SqlDbType.VarChar, 255).Value = m.Description ?? (object)DBNull.Value;

            return cmd.ExecuteNonQuery();
        }

        public int Delete(int id)
        {
            using SqlConnection conn = new SqlConnection(_connStr);
            conn.Open();

            SqlCommand cmd = new SqlCommand("DELETE FROM Category WHERE CategoryID=@ID", conn);
            cmd.Parameters.Add("@ID", SqlDbType.Int).Value = id;

            return cmd.ExecuteNonQuery();
        }
    }
}
