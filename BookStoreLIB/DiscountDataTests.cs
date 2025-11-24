using System;
using System.Data;
using System.Data.SqlClient;
using Microsoft.VisualStudio.TestTools.UnitTesting;

namespace BookStoreLIB
{
    [TestClass]
    public class DiscountDataTests
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

        private DataRow GetDiscount(string code)
        {
            var dt = new DataTable();

            using (var conn = new SqlConnection(ResolveConn()))
            using (var cmd = new SqlCommand("SELECT * FROM DiscountData WHERE Ccode = @C;", conn))
            using (var da = new SqlDataAdapter(cmd))
            {
                cmd.Parameters.AddWithValue("@C", code);
                conn.Open();
                da.Fill(dt);
            }

            return dt.Rows.Count > 0 ? dt.Rows[0] : null;
        }

        [TestMethod]
        public void Discount_Add()
        {
            string code = "DISCADD1";

            // cleanup
            using (var conn = new SqlConnection(ResolveConn()))
            using (var cmd = new SqlCommand("DELETE FROM DiscountData WHERE Ccode=@C;", conn))
            {
                cmd.Parameters.AddWithValue("@C", code);
                conn.Open();
                cmd.ExecuteNonQuery();
            }

            // insert
            using (var conn = new SqlConnection(ResolveConn()))
            using (var cmd = new SqlCommand(
                @"INSERT INTO DiscountData (Ccode, discount, DiscountDesc)
                  VALUES (@C, 10.00, 'Test discount');", conn))
            {
                cmd.Parameters.AddWithValue("@C", code);
                conn.Open();
                cmd.ExecuteNonQuery();
            }

            Assert.IsNotNull(GetDiscount(code));
        }

        [TestMethod]
        public void Discount_Edit()
        {
            string code = "DISCEDIT1";

            // cleanup
            using (var conn = new SqlConnection(ResolveConn()))
            using (var cmd = new SqlCommand("DELETE FROM DiscountData WHERE Ccode=@C;", conn))
            {
                cmd.Parameters.AddWithValue("@C", code);
                conn.Open();
                cmd.ExecuteNonQuery();
            }

            // insert
            using (var conn = new SqlConnection(ResolveConn()))
            using (var cmd = new SqlCommand(
                @"INSERT INTO DiscountData (Ccode, discount, DiscountDesc)
                  VALUES (@C, 5.00, 'Before');", conn))
            {
                cmd.Parameters.AddWithValue("@C", code);
                conn.Open();
                cmd.ExecuteNonQuery();
            }

            // update
            using (var conn = new SqlConnection(ResolveConn()))
            using (var cmd = new SqlCommand(
                @"UPDATE DiscountData SET DiscountDesc='After' WHERE Ccode=@C;", conn))
            {
                cmd.Parameters.AddWithValue("@C", code);
                conn.Open();
                cmd.ExecuteNonQuery();
            }

            Assert.AreEqual("After", GetDiscount(code)?["DiscountDesc"]?.ToString());
        }

        [TestMethod]
        public void Discount_Remove()
        {
            string code = "DISCREM1";

            // cleanup
            using (var conn = new SqlConnection(ResolveConn()))
            using (var cmd = new SqlCommand("DELETE FROM DiscountData WHERE Ccode=@C;", conn))
            {
                cmd.Parameters.AddWithValue("@C", code);
                conn.Open();
                cmd.ExecuteNonQuery();
            }

            // insert
            using (var conn = new SqlConnection(ResolveConn()))
            using (var cmd = new SqlCommand(
                @"INSERT INTO DiscountData (Ccode, discount, DiscountDesc)
                  VALUES (@C, 8.00, 'DeleteMe');", conn))
            {
                cmd.Parameters.AddWithValue("@C", code);
                conn.Open();
                cmd.ExecuteNonQuery();
            }

            // delete
            using (var conn = new SqlConnection(ResolveConn()))
            using (var cmd = new SqlCommand("DELETE FROM DiscountData WHERE Ccode=@C;", conn))
            {
                cmd.Parameters.AddWithValue("@C", code);
                conn.Open();
                cmd.ExecuteNonQuery();
            }

            Assert.IsNull(GetDiscount(code));
        }
    }
}
