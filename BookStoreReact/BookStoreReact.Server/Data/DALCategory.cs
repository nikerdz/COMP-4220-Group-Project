using System;
using System.Collections.Generic;
using System.Data.SqlClient;
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


        
        // GET ALL CATEGORIES
        
        public List<CategoryModel> GetAll()
        {
            List<CategoryModel> list = new List<CategoryModel>();

            using (SqlConnection conn = new SqlConnection(_connStr))
            {
                conn.Open();
                SqlCommand cmd = new SqlCommand(@"
                    SELECT CategoryID, Name
                    FROM Category
                    ORDER BY CategoryID;
                ", conn);

                SqlDataReader r = cmd.ExecuteReader();

                while (r.Read())
                {
                    list.Add(new CategoryModel
                    {
                        CategoryID = Convert.ToInt32(r["CategoryID"]),
                        Name = r["Name"].ToString()
                    });
                }
            }

            return list;
        }



        
        // ADD CATEGORY (SAFE)
        
        public void Add(CategoryModel m)
        {
            using (SqlConnection conn = new SqlConnection(_connStr))
            {
                conn.Open();

                // Generate next CategoryID like your UserData trigger
                SqlCommand getIdCmd = new SqlCommand(
                    "SELECT ISNULL(MAX(CategoryID), 0) + 1 FROM Category",
                    conn
                );

                int nextId = Convert.ToInt32(getIdCmd.ExecuteScalar());

                SqlCommand cmd = new SqlCommand(@"
                    INSERT INTO Category (CategoryID, Name)
                    VALUES (@ID, @N);
                ", conn);

                cmd.Parameters.AddWithValue("@ID", nextId);
                cmd.Parameters.AddWithValue("@N", m.Name ?? "");

                cmd.ExecuteNonQuery();
            }
        }



        
        // UPDATE CATEGORY
        
        public void Update(int id, CategoryModel m)
        {
            using (SqlConnection conn = new SqlConnection(_connStr))
            {
                conn.Open();

                SqlCommand cmd = new SqlCommand(@"
                    UPDATE Category SET
                        Name=@N
                    WHERE CategoryID=@ID;
                ", conn);

                cmd.Parameters.AddWithValue("@ID", id);
                cmd.Parameters.AddWithValue("@N", m.Name ?? "");

                cmd.ExecuteNonQuery();
            }
        }



        
        // DELETE CATEGORY
        
        public void Delete(int id)
        {
            using (SqlConnection conn = new SqlConnection(_connStr))
            {
                conn.Open();

                SqlCommand cmd = new SqlCommand(@"
                    DELETE FROM Category
                    WHERE CategoryID=@ID;
                ", conn);

                cmd.Parameters.AddWithValue("@ID", id);
                cmd.ExecuteNonQuery();
            }
        }
    }
}
