using System;
using System.Collections.Generic;
using Microsoft.Data.SqlClient;
using System.Data;
using System.Data.SqlClient;
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

        public List<SupplierModel> GetAll()
        {
            List<SupplierModel> list = new();

            using SqlConnection conn = new SqlConnection(_connStr);
            conn.Open();

            SqlCommand cmd = new SqlCommand("SELECT SupplierID, Name FROM Supplier ORDER BY SupplierID", conn);
            SqlDataReader r = cmd.ExecuteReader();

            while (r.Read())
            {
                list.Add(new SupplierModel
                {
                    SupplierID = Convert.ToInt32(r["SupplierID"]),
                    Name = r["Name"].ToString() ?? ""
                });
            }

            return list;
        }

        public int Add(SupplierModel m)
        {
            using SqlConnection conn = new SqlConnection(_connStr);
            conn.Open();

            SqlCommand cmd = new SqlCommand(
                @"INSERT INTO Supplier (SupplierID, Name)
                  VALUES (@ID, @N)", conn);

            cmd.Parameters.Add("@ID", SqlDbType.Int).Value = m.SupplierID;
            cmd.Parameters.Add("@N", SqlDbType.VarChar, 50).Value = m.Name;

            return cmd.ExecuteNonQuery();
        }

        public int Update(SupplierModel m)
        {
            using SqlConnection conn = new SqlConnection(_connStr);
            conn.Open();

            SqlCommand cmd = new SqlCommand(
                @"UPDATE Supplier
                  SET Name=@N
                  WHERE SupplierID=@ID", conn);

            cmd.Parameters.Add("@ID", SqlDbType.Int).Value = m.SupplierID;
            cmd.Parameters.Add("@N", SqlDbType.VarChar, 50).Value = m.Name;

            return cmd.ExecuteNonQuery();
        }

        public int Delete(int id)
        {
            using SqlConnection conn = new SqlConnection(_connStr);
            conn.Open();

            SqlCommand cmd = new SqlCommand("DELETE FROM Supplier WHERE SupplierID=@ID", conn);
            cmd.Parameters.Add("@ID", SqlDbType.Int).Value = id;

            return cmd.ExecuteNonQuery();
        }
    }
}
