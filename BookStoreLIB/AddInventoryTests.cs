using System;
using System.Data;
using System.Data.SqlClient;
using Microsoft.VisualStudio.TestTools.UnitTesting;

namespace BookStoreLIB
{
    [TestClass]
    public class AddInventoryTests
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
        public void AddInventory_ShouldInsertNewBook()
        {
            string isbn = "UNITADD001";
            string title = "UnitTest_AddBook";
            string author = "Test_Author";

            // PRE-CLEAN
            using (var conn = new SqlConnection(ResolveConn()))
            using (var cmd = new SqlCommand("DELETE FROM BookData WHERE ISBN=@I", conn))
            {
                cmd.Parameters.AddWithValue("@I", isbn);
                conn.Open();
                cmd.ExecuteNonQuery();
            }

            // INSERT
            using (var conn = new SqlConnection(ResolveConn()))
            using (var cmd = new SqlCommand(@"
                INSERT INTO BookData
                (ISBN, CategoryID, Title, Author, Price, SupplierId, Year, Edition, Publisher, InStock)
                VALUES (@I, 1, @T, @A, 10.00, NULL, '2024', '1', 'UnitPub', 5)", conn))
            {
                cmd.Parameters.AddWithValue("@I", isbn);
                cmd.Parameters.AddWithValue("@T", title);
                cmd.Parameters.AddWithValue("@A", author);
                conn.Open();
                cmd.ExecuteNonQuery();
            }

            var row = GetBook(isbn);

            Assert.IsNotNull(row);
            Assert.AreEqual(title, row["Title"].ToString());
            Assert.AreEqual(author, row["Author"].ToString());
            Assert.AreEqual(5, Convert.ToInt32(row["InStock"]));

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
