using System;
using System.Collections.Generic;
using Microsoft.Data.SqlClient;
using BookStoreReact.Server.Models;

namespace BookStoreReact.Server.Data
{
    public class DALSupplier
    {
        private readonly string _connStr;

        public DALSupplier(IConfiguration config)
        {
            _connStr = config.GetConnectionString("DefaultConnection");
        }

        
        // GET ALL SUPPLIERS
        
        public List<SupplierModel> GetAll()
        {
            List<SupplierModel> list = new();

            using (SqlConnection conn = new SqlConnection(_connStr))
            {
                conn.Open();
                SqlCommand cmd = new SqlCommand(@"
                    SELECT SupplierId, Name 
                    FROM Supplier
                    ORDER BY SupplierId;
                ", conn);

                SqlDataReader r = cmd.ExecuteReader();

                while (r.Read())
                {
                    list.Add(new SupplierModel
                    {
                        SupplierId = Convert.ToInt32(r["SupplierId"]),
                        Name = r["Name"].ToString()
                    });
                }
            }

            return list;
        }

        
        // ADD SUPPLIER (AUTO-GENERATED ID)
        
        public void Add(SupplierModel m)
        {
            using (SqlConnection conn = new SqlConnection(_connStr))
            {
                conn.Open();

                // 1) Compute next SupplierId
                SqlCommand cmdId = new SqlCommand(
                    "SELECT ISNULL(MAX(SupplierId), 0) + 1 FROM Supplier",
                    conn
                );

                int nextId = Convert.ToInt32(cmdId.ExecuteScalar());

                // 2) Insert supplier with generated ID
                SqlCommand cmd = new SqlCommand(@"
                    INSERT INTO Supplier (SupplierId, Name)
                    VALUES (@ID, @Name);
                ", conn);

                cmd.Parameters.AddWithValue("@ID", nextId);
                cmd.Parameters.AddWithValue("@Name", m.Name ?? "");

                cmd.ExecuteNonQuery();
            }
        }

        
        // UPDATE SUPPLIER
        
        public void Update(int id, SupplierModel m)
        {
            using (SqlConnection conn = new SqlConnection(_connStr))
            {
                conn.Open();

                SqlCommand cmd = new SqlCommand(@"
                    UPDATE Supplier SET
                        Name=@Name
                    WHERE SupplierId=@ID;
                ", conn);

                cmd.Parameters.AddWithValue("@ID", id);
                cmd.Parameters.AddWithValue("@Name", m.Name ?? "");

                cmd.ExecuteNonQuery();
            }
        }

        
        // DELETE SUPPLIER
        
        public void Delete(int id)
        {
            using (SqlConnection conn = new SqlConnection(_connStr))
            {
                conn.Open();

                SqlCommand cmd = new SqlCommand(@"
                    DELETE FROM Supplier
                    WHERE SupplierId=@ID;
                ", conn);

                cmd.Parameters.AddWithValue("@ID", id);

                cmd.ExecuteNonQuery();
            }
        }
    }
}
