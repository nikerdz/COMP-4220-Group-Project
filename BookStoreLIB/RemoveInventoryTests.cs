using System;
using System.Data.SqlClient;
using Microsoft.VisualStudio.TestTools.UnitTesting;

namespace BookStoreLIB
{
    [TestClass]
    public class RemoveInventoryTests
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

            return new SqlConnectionStringBuilder
            {
                DataSource = server,
                InitialCatalog = db,
                UserID = user,
                Password = pass,
                Encrypt = true,
                TrustServerCertificate = true
            }.ConnectionString;
        }

        private bool Exists(string isbn)
        {
            using (var conn = new SqlConnection(ResolveConn()))
            using (var cmd = new SqlCommand("SELECT COUNT(*) FROM BookData WHERE ISBN=@I", conn))
            {
                cmd.Parameters.AddWithValue("@I", isbn);
                conn.Open();
                return (int)cmd.ExecuteScalar() > 0;
            }
        }

        [TestMethod]
        public void RemoveInventory_ShouldDeleteBook()
        {
            string isbn = "UNITREM001";

            // PRE-CLEAN
            using (var conn = new SqlConnection(ResolveConn()))
            using (var cmd = new SqlCommand("DELETE FROM BookData WHERE ISBN=@I", conn))
            {
                cmd.Parameters.AddWithValue("@I", isbn);
                conn.Open();
                cmd.ExecuteNonQuery();
            }

            // INSERT record to delete
            using (var conn = new SqlConnection(ResolveConn()))
            using (var cmd = new SqlCommand(@"
                INSERT INTO BookData
                (ISBN, CategoryID, Title, Author, Price, SupplierId, Year, Edition, Publisher, InStock)
                VALUES (@I, 1, 'DeleteMe', 'Tester', 8.50, NULL, '2024', '1', 'UnitPub', 3)", conn))
            {
                cmd.Parameters.AddWithValue("@I", isbn);
                conn.Open();
                cmd.ExecuteNonQuery();
            }

            Assert.IsTrue(Exists(isbn));

            // DELETE
            using (var conn = new SqlConnection(ResolveConn()))
            using (var cmd = new SqlCommand("DELETE FROM BookData WHERE ISBN=@I", conn))
            {
                cmd.Parameters.AddWithValue("@I", isbn);
                conn.Open();
                cmd.ExecuteNonQuery();
            }

            Assert.IsFalse(Exists(isbn));
        }
    }
}
