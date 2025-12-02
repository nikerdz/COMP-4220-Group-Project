using System.Data.SqlClient;
using System.Data;
using BookStoreReact.Server.Models;

namespace BookStoreReact.Server.Data
{
    public class DALUserAdmin
    {
        private readonly string _connStr;

        public DALUserAdmin(IConfiguration config)
        {
            _connStr = config.GetConnectionString("DefaultConnection");
        }

        public List<UserAdminModel> GetAll()
        {
            var list = new List<UserAdminModel>();

            using SqlConnection conn = new SqlConnection(_connStr);
            conn.Open();

            SqlCommand cmd = new SqlCommand(
                "SELECT UserID, UserName, FullName, Email, Type, Manager FROM UserData ORDER BY UserID",
                conn);

            SqlDataReader r = cmd.ExecuteReader();

            while (r.Read())
            {
                list.Add(new UserAdminModel
                {
                    UserID = Convert.ToInt32(r["UserID"]),
                    UserName = r["UserName"].ToString(),
                    FullName = r["FullName"]?.ToString(),
                    Email = r["Email"]?.ToString(),
                    Type = r["Type"].ToString(),
                    Manager = Convert.ToBoolean(r["Manager"])
                });
            }

            return list;
        }

        public int Add(UserAdminModel m)
        {
            using SqlConnection conn = new SqlConnection(_connStr);
            conn.Open();

            // FORCE TYPE = AD
            m.Type = "AD";

            SqlCommand cmd = new SqlCommand(@"
                INSERT INTO UserData (UserName, Password, Type, Manager, FullName, Email)
                VALUES (@U, @P, @T, @M, @F, @E)", conn);

            cmd.Parameters.Add("@U", SqlDbType.VarChar, 20).Value = m.UserName;
            cmd.Parameters.Add("@P", SqlDbType.VarChar, 25).Value = m.Password ?? "default";
            cmd.Parameters.Add("@T", SqlDbType.Char, 2).Value = m.Type;
            cmd.Parameters.Add("@M", SqlDbType.Bit).Value = m.Manager;
            cmd.Parameters.Add("@F", SqlDbType.NVarChar, 50).Value = m.FullName ?? (object)DBNull.Value;
            cmd.Parameters.Add("@E", SqlDbType.VarChar, 50).Value = m.Email ?? (object)DBNull.Value;

            return cmd.ExecuteNonQuery();
        }

        public int Update(UserAdminModel m)
        {
            using SqlConnection conn = new SqlConnection(_connStr);
            conn.Open();

            // TYPE always stays AD
            m.Type = "AD";

            SqlCommand cmd = new SqlCommand(@"
                UPDATE UserData SET
                    UserName=@U,
                    FullName=@F,
                    Email=@E,
                    Type=@T,
                    Manager=@M
                WHERE UserID=@ID", conn);

            cmd.Parameters.Add("@ID", SqlDbType.Int).Value = m.UserID;
            cmd.Parameters.Add("@U", SqlDbType.VarChar, 20).Value = m.UserName;
            cmd.Parameters.Add("@F", SqlDbType.NVarChar, 50).Value = m.FullName ?? (object)DBNull.Value;
            cmd.Parameters.Add("@E", SqlDbType.VarChar, 50).Value = m.Email ?? (object)DBNull.Value;
            cmd.Parameters.Add("@T", SqlDbType.Char, 2).Value = m.Type;
            cmd.Parameters.Add("@M", SqlDbType.Bit).Value = m.Manager;

            return cmd.ExecuteNonQuery();
        }

        public int Delete(int id)
        {
            using SqlConnection conn = new SqlConnection(_connStr);
            conn.Open();

            SqlCommand cmd = new SqlCommand("DELETE FROM UserData WHERE UserID=@ID", conn);
            cmd.Parameters.Add("@ID", SqlDbType.Int).Value = id;

            return cmd.ExecuteNonQuery();
        }
    }
}
