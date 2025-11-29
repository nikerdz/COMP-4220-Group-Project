using BookStoreReact.Server.Models;      //  Correct model namespace
using System;
using System.Collections.Generic;
using System.Data.SqlClient;

namespace BookStoreReact.Server.Data      // Correct Data namespace
{
    public class DALUserAdmin
    {
        private readonly string _connStr;

        public DALUserAdmin(IConfiguration config)
        {
            _connStr = config.GetConnectionString("DefaultConnection");
        }

        // ------------------------------------------------------------
        // GET ALL USERS
        // ------------------------------------------------------------
        public List<UserAdminModel> GetAll()
        {
            List<UserAdminModel> list = new();

            using (SqlConnection conn = new SqlConnection(_connStr))
            {
                conn.Open();

                SqlCommand cmd = new SqlCommand(@"
                    SELECT UserID, UserName, Type, Manager, FullName, Email
                    FROM UserData
                    ORDER BY UserID;
                ", conn);

                SqlDataReader r = cmd.ExecuteReader();

                while (r.Read())
                {
                    list.Add(new UserAdminModel
                    {
                        UserID = Convert.ToInt32(r["UserID"]),
                        UserName = r["UserName"].ToString(),
                        Type = r["Type"].ToString(),
                        Manager = Convert.ToBoolean(r["Manager"]),
                        FullName = r["FullName"] == DBNull.Value ? "" : r["FullName"].ToString(),
                        Email = r["Email"] == DBNull.Value ? "" : r["Email"].ToString()
                    });
                }
            }

            return list;
        }

        // ------------------------------------------------------------
        // ADD USER
        // ------------------------------------------------------------
        public void AddUser(UserAdminModel m)
        {
            using (SqlConnection conn = new SqlConnection(_connStr))
            {
                conn.Open();

                SqlCommand cmd = new SqlCommand(@"
                    INSERT INTO UserData
                        (UserName, Password, Type, Manager, FullName, Email)
                    VALUES
                        (@U, @P, @T, @M, @F, @E);
                ", conn);

                cmd.Parameters.AddWithValue("@U", m.UserName);
                cmd.Parameters.AddWithValue("@P", m.Password);   // password required
                cmd.Parameters.AddWithValue("@T", m.Type);
                cmd.Parameters.AddWithValue("@M", m.Manager);
                cmd.Parameters.AddWithValue("@F", (object?)m.FullName ?? DBNull.Value);
                cmd.Parameters.AddWithValue("@E", (object?)m.Email ?? DBNull.Value);

                cmd.ExecuteNonQuery();
            }
        }

        // ------------------------------------------------------------
        // UPDATE USER
        // ------------------------------------------------------------
        public void UpdateUser(int id, UserAdminModel m)
        {
            using (SqlConnection conn = new SqlConnection(_connStr))
            {
                conn.Open();

                SqlCommand cmd = new SqlCommand(@"
                    UPDATE UserData SET
                        FullName = @F,
                        Email = @E,
                        Type = @T,
                        Manager = @M
                    WHERE UserID = @ID;
                ", conn);

                cmd.Parameters.AddWithValue("@ID", id);
                cmd.Parameters.AddWithValue("@F", (object?)m.FullName ?? DBNull.Value);
                cmd.Parameters.AddWithValue("@E", (object?)m.Email ?? DBNull.Value);
                cmd.Parameters.AddWithValue("@T", m.Type);
                cmd.Parameters.AddWithValue("@M", m.Manager);

                cmd.ExecuteNonQuery();
            }
        }

        // ------------------------------------------------------------
        // DELETE USER
        // ------------------------------------------------------------
        public void DeleteUser(int userId)
        {
            using (SqlConnection conn = new SqlConnection(_connStr))
            {
                conn.Open();

                SqlCommand cmd = new SqlCommand(@"
                    DELETE FROM UserData 
                    WHERE UserID = @ID;
                ", conn);

                cmd.Parameters.AddWithValue("@ID", userId);
                cmd.ExecuteNonQuery();
            }
        }
    }
}
