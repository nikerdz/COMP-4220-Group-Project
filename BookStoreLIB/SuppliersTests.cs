using System;
using System.Data;
using System.Data.SqlClient;
using Microsoft.VisualStudio.TestTools.UnitTesting;

namespace BookStoreLIB
{
    [TestClass]
    public class SuppliersTests
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

        private DataRow GetSupplier(int id)
        {
            var dt = new DataTable();

            using (var conn = new SqlConnection(ResolveConn()))
            using (var cmd = new SqlCommand("SELECT * FROM Supplier WHERE SupplierId = @ID;", conn))
            using (var da = new SqlDataAdapter(cmd))
            {
                cmd.Parameters.AddWithValue("@ID", id);
                conn.Open();
                da.Fill(dt);
            }

            return dt.Rows.Count > 0 ? dt.Rows[0] : null;
        }

        [TestMethod]
        public void Supplier_Add()
        {
            int id = 8881;

            // cleanup
            using (var conn = new SqlConnection(ResolveConn()))
            using (var cmd = new SqlCommand("DELETE FROM Supplier WHERE SupplierId=@ID;", conn))
            {
                cmd.Parameters.AddWithValue("@ID", id);
                conn.Open();
                cmd.ExecuteNonQuery();
            }

            // insert
            using (var conn = new SqlConnection(ResolveConn()))
            using (var cmd = new SqlCommand(
                   "INSERT INTO Supplier (SupplierId, Name) VALUES (@ID, 'UnitTestSupplier');", conn))
            {
                cmd.Parameters.AddWithValue("@ID", id);
                conn.Open();
                cmd.ExecuteNonQuery();
            }

            Assert.IsNotNull(GetSupplier(id));
        }

        [TestMethod]
        public void Supplier_Edit()
        {
            int id = 8882;

            // cleanup
            using (var conn = new SqlConnection(ResolveConn()))
            using (var cmd = new SqlCommand("DELETE FROM Supplier WHERE SupplierId=@ID;", conn))
            {
                cmd.Parameters.AddWithValue("@ID", id);
                conn.Open();
                cmd.ExecuteNonQuery();
            }

            // insert
            using (var conn = new SqlConnection(ResolveConn()))
            using (var cmd = new SqlCommand(
                   "INSERT INTO Supplier (SupplierId, Name) VALUES (@ID, 'Before');", conn))
            {
                cmd.Parameters.AddWithValue("@ID", id);
                conn.Open();
                cmd.ExecuteNonQuery();
            }

            // update
            using (var conn = new SqlConnection(ResolveConn()))
            using (var cmd = new SqlCommand(
                   "UPDATE Supplier SET Name='After' WHERE SupplierId=@ID;", conn))
            {
                cmd.Parameters.AddWithValue("@ID", id);
                conn.Open();
                cmd.ExecuteNonQuery();
            }

            Assert.AreEqual("After", GetSupplier(id)?["Name"]?.ToString());
        }

        [TestMethod]
        public void Supplier_Remove()
        {
            int id = 8883;

            // cleanup
            using (var conn = new SqlConnection(ResolveConn()))
            using (var cmd = new SqlCommand("DELETE FROM Supplier WHERE SupplierId=@ID;", conn))
            {
                cmd.Parameters.AddWithValue("@ID", id);
                conn.Open();
                cmd.ExecuteNonQuery();
            }

            // insert
            using (var conn = new SqlConnection(ResolveConn()))
            using (var cmd = new SqlCommand(
                   "INSERT INTO Supplier (SupplierId, Name) VALUES (@ID, 'DeleteMe');", conn))
            {
                cmd.Parameters.AddWithValue("@ID", id);
                conn.Open();
                cmd.ExecuteNonQuery();
            }

            // delete
            using (var conn = new SqlConnection(ResolveConn()))
            using (var cmd = new SqlCommand("DELETE FROM Supplier WHERE SupplierId=@ID;", conn))
            {
                cmd.Parameters.AddWithValue("@ID", id);
                conn.Open();
                cmd.ExecuteNonQuery();
            }

            Assert.IsNull(GetSupplier(id));
        }
    }
}
