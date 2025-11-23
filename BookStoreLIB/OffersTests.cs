using System;
using System.Data;
using System.Data.SqlClient;
using Microsoft.VisualStudio.TestTools.UnitTesting;

namespace BookStoreLIB
{
    [TestClass]
    public class OffersTests
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

        private DataRow GetCoupon(string code)
        {
            var dt = new DataTable();

            using (var conn = new SqlConnection(ResolveConn()))
            using (var cmd = new SqlCommand("SELECT * FROM Coupon WHERE Code = @C;", conn))
            using (var da = new SqlDataAdapter(cmd))
            {
                cmd.Parameters.AddWithValue("@C", code);
                conn.Open();
                da.Fill(dt);
            }

            return dt.Rows.Count > 0 ? dt.Rows[0] : null;
        }

        [TestMethod]
        public void Offer_Add()
        {
            string code = "UNITADD1";

            // cleanup
            using (var conn = new SqlConnection(ResolveConn()))
            using (var cmd = new SqlCommand("DELETE FROM Coupon WHERE Code=@C;", conn))
            {
                cmd.Parameters.AddWithValue("@C", code);
                conn.Open();
                cmd.ExecuteNonQuery();
            }

            // insert
            using (var conn = new SqlConnection(ResolveConn()))
            using (var cmd = new SqlCommand(
                @"INSERT INTO Coupon (Code, Description, DiscountRate, UsageLimit, StartDate, EndDate)
                  VALUES (@C, 'Unit Test Offer', 0.20, 50, GETDATE(), NULL);", conn))
            {
                cmd.Parameters.AddWithValue("@C", code);
                conn.Open();
                cmd.ExecuteNonQuery();
            }

            Assert.IsNotNull(GetCoupon(code));
        }

        [TestMethod]
        public void Offer_Edit()
        {
            string code = "UNITEDIT1";

            // cleanup
            using (var conn = new SqlConnection(ResolveConn()))
            using (var cmd = new SqlCommand("DELETE FROM Coupon WHERE Code=@C;", conn))
            {
                cmd.Parameters.AddWithValue("@C", code);
                conn.Open();
                cmd.ExecuteNonQuery();
            }

            // insert
            using (var conn = new SqlConnection(ResolveConn()))
            using (var cmd = new SqlCommand(
                @"INSERT INTO Coupon (Code, Description, DiscountRate, UsageLimit)
                  VALUES (@C, 'BeforeEdit', 0.10, 20);", conn))
            {
                cmd.Parameters.AddWithValue("@C", code);
                conn.Open();
                cmd.ExecuteNonQuery();
            }

            // update
            using (var conn = new SqlConnection(ResolveConn()))
            using (var cmd = new SqlCommand(
                @"UPDATE Coupon SET Description='AfterEdit' WHERE Code=@C;", conn))
            {
                cmd.Parameters.AddWithValue("@C", code);
                conn.Open();
                cmd.ExecuteNonQuery();
            }

            Assert.AreEqual("AfterEdit", GetCoupon(code)?["Description"]?.ToString());
        }

        [TestMethod]
        public void Offer_Remove()
        {
            string code = "UNITDEL1";

            // cleanup
            using (var conn = new SqlConnection(ResolveConn()))
            using (var cmd = new SqlCommand("DELETE FROM Coupon WHERE Code=@C;", conn))
            {
                cmd.Parameters.AddWithValue("@C", code);
                conn.Open();
                cmd.ExecuteNonQuery();
            }

            // insert
            using (var conn = new SqlConnection(ResolveConn()))
            using (var cmd = new SqlCommand(
                @"INSERT INTO Coupon (Code, Description, DiscountRate)
                  VALUES (@C, 'ToDelete', 0.30);", conn))
            {
                cmd.Parameters.AddWithValue("@C", code);
                conn.Open();
                cmd.ExecuteNonQuery();
            }

            // delete
            using (var conn = new SqlConnection(ResolveConn()))
            using (var cmd = new SqlCommand("DELETE FROM Coupon WHERE Code=@C;", conn))
            {
                cmd.Parameters.AddWithValue("@C", code);
                conn.Open();
                cmd.ExecuteNonQuery();
            }

            Assert.IsNull(GetCoupon(code));
        }
    }
}
