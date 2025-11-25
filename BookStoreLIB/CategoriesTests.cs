using System;
using System.Data;
using System.Data.SqlClient;
using Microsoft.VisualStudio.TestTools.UnitTesting;

namespace BookStoreLIB
{
    [TestClass]
    public class CategoriesTests
    {
        private string ResolveConn()
        {
            var user = Environment.GetEnvironmentVariable("AGILE_DB_USER");
            var pass = Environment.GetEnvironmentVariable("AGILE_DB_PASSWORD");
            var server = Environment.GetEnvironmentVariable("AGILE_DB_SERVER") ?? "tfs.cs.uwindsor.ca";
            var db = Environment.GetEnvironmentVariable("AGILE_DB_NAME") ?? "Agile1422DB25";

            if (string.IsNullOrWhiteSpace(user) || string.IsNullOrWhiteSpace(pass))
            {
                user = "Agile1422U25";
                pass = "Agile1422U25$";
            }

            var builder = new SqlConnectionStringBuilder
            {
                DataSource = server,
                InitialCatalog = db,
                PersistSecurityInfo = true,
                UserID = user,
                Password = pass,
                Encrypt = true,
                TrustServerCertificate = true
            };

            return builder.ConnectionString;
        }

        private DataRow GetCategory(int id)
        {
            var dt = new DataTable();

            using (var conn = new SqlConnection(ResolveConn()))
            using (var cmd = new SqlCommand("SELECT * FROM Category WHERE CategoryID = @ID;", conn))
            using (var da = new SqlDataAdapter(cmd))
            {
                cmd.Parameters.AddWithValue("@ID", id);
                conn.Open();
                da.Fill(dt);
            }

            return dt.Rows.Count > 0 ? dt.Rows[0] : null;
        }

        [TestMethod]
        public void Category_Add()
        {
            int id = 9991;

            // cleanup if already exists
            using (var conn = new SqlConnection(ResolveConn()))
            using (var cmd = new SqlCommand("DELETE FROM Category WHERE CategoryID = @ID;", conn))
            {
                cmd.Parameters.AddWithValue("@ID", id);
                conn.Open();
                cmd.ExecuteNonQuery();
            }

            // insert
            using (var conn = new SqlConnection(ResolveConn()))
            using (var cmd = new SqlCommand(
                   "INSERT INTO Category (CategoryID, Name) VALUES (@ID, 'UnitTestCat');", conn))
            {
                cmd.Parameters.AddWithValue("@ID", id);
                conn.Open();
                cmd.ExecuteNonQuery();
            }

            Assert.IsNotNull(GetCategory(id));
        }

        [TestMethod]
        public void Category_Edit()
        {
            int id = 9992;

            // cleanup if already exists
            using (var conn = new SqlConnection(ResolveConn()))
            using (var cmd = new SqlCommand("DELETE FROM Category WHERE CategoryID = @ID;", conn))
            {
                cmd.Parameters.AddWithValue("@ID", id);
                conn.Open();
                cmd.ExecuteNonQuery();
            }

            // insert base row
            using (var conn = new SqlConnection(ResolveConn()))
            using (var cmd = new SqlCommand(
                   "INSERT INTO Category (CategoryID, Name) VALUES (@ID, 'BeforeEdit');", conn))
            {
                cmd.Parameters.AddWithValue("@ID", id);
                conn.Open();
                cmd.ExecuteNonQuery();
            }

            // update
            using (var conn = new SqlConnection(ResolveConn()))
            using (var cmd = new SqlCommand(
                   "UPDATE Category SET Name='AfterEdit' WHERE CategoryID=@ID;", conn))
            {
                cmd.Parameters.AddWithValue("@ID", id);
                conn.Open();
                cmd.ExecuteNonQuery();
            }

            Assert.AreEqual("AfterEdit", GetCategory(id)?["Name"]?.ToString());
        }

        [TestMethod]
        public void Category_Remove()
        {
            int id = 9993;

            // cleanup if already exists
            using (var conn = new SqlConnection(ResolveConn()))
            using (var cmd = new SqlCommand("DELETE FROM Category WHERE CategoryID = @ID;", conn))
            {
                cmd.Parameters.AddWithValue("@ID", id);
                conn.Open();
                cmd.ExecuteNonQuery();
            }

            // insert row to delete
            using (var conn = new SqlConnection(ResolveConn()))
            using (var cmd = new SqlCommand(
                   "INSERT INTO Category (CategoryID, Name) VALUES (@ID, 'ToDelete');", conn))
            {
                cmd.Parameters.AddWithValue("@ID", id);
                conn.Open();
                cmd.ExecuteNonQuery();
            }

            // delete
            using (var conn = new SqlConnection(ResolveConn()))
            using (var cmd = new SqlCommand(
                   "DELETE FROM Category WHERE CategoryID = @ID;", conn))
            {
                cmd.Parameters.AddWithValue("@ID", id);
                conn.Open();
                cmd.ExecuteNonQuery();
            }

            Assert.IsNull(GetCategory(id));
        }
    }
}
