using System;
using System.Data;
using System.Data.SqlClient;
using Microsoft.VisualStudio.TestTools.UnitTesting;

namespace BookStoreLIB
{
    [TestClass]
    public class EditInventoryTests
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

        private DataRow GetBook(string isbn)
        {
            var dt = new DataTable();

            using (var conn = new SqlConnection(ResolveConn()))
            using (var cmd = new SqlCommand("SELECT * FROM BookData WHERE ISBN = @I", conn))
            using (var ad = new SqlDataAdapter(cmd))
            {
                cmd.Parameters.AddWithValue("@I", isbn);
                conn.Open();
                ad.Fill(dt);
            }

            return dt.Rows.Count > 0 ? dt.Rows[0] : null;
        }

        [TestMethod]
        public void EditInventory_ShouldUpdateBookTitle()
        {
            string isbn = "UNITEDIT01";
            string original = "Original_Title";
            string updated = "Updated_Title";

            // PRE-CLEAN
            using (var conn = new SqlConnection(ResolveConn()))
            using (var cmd = new SqlCommand("DELETE FROM BookData WHERE ISBN=@I", conn))
            {
                cmd.Parameters.AddWithValue("@I", isbn);
                conn.Open();
                cmd.ExecuteNonQuery();
            }

            // INSERT base record
            using (var conn = new SqlConnection(ResolveConn()))
            using (var cmd = new SqlCommand(@"
                INSERT INTO BookData
                (ISBN, CategoryID, Title, Author, Price, SupplierId, Year, Edition, Publisher, InStock)
                VALUES (@I, 1, @T, 'Tester', 15, NULL, '2024', '1', 'UnitPub', 4)", conn))
            {
                cmd.Parameters.AddWithValue("@I", isbn);
                cmd.Parameters.AddWithValue("@T", original);
                conn.Open();
                cmd.ExecuteNonQuery();
            }

            // UPDATE
            using (var conn = new SqlConnection(ResolveConn()))
            using (var cmd = new SqlCommand("UPDATE BookData SET Title=@T WHERE ISBN=@I", conn))
            {
                cmd.Parameters.AddWithValue("@I", isbn);
                cmd.Parameters.AddWithValue("@T", updated);
                conn.Open();
                cmd.ExecuteNonQuery();
            }

            var row = GetBook(isbn);

            Assert.IsNotNull(row);
            Assert.AreEqual(updated, row["Title"].ToString());

            // CLEANUP
            using (var conn = new SqlConnection(ResolveConn()))
            using (var cmd = new SqlCommand("DELETE FROM BookData WHERE ISBN=@I", conn))
            {
                cmd.Parameters.AddWithValue("@I", isbn);
                conn.Open();
                cmd.ExecuteNonQuery();
            }
        }
    }
}
