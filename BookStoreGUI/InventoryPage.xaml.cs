using System;
using System.Data;
using System.Data.SqlClient;
using System.Windows;
using System.Windows.Controls;

namespace BookStoreGUI.Pages
{
    public partial class InventoryPage : UserControl
    {
        public InventoryPage()
        {
            InitializeComponent();
            LoadInventory();
        }

        private string ConnStr =>
            "Data Source=tfs.cs.uwindsor.ca;Initial Catalog=Agile1422DB25;" +
            "Persist Security Info=True;User ID=Agile1422U25;Password=Agile1422U25$;" +
            "Encrypt=True;TrustServerCertificate=True";

        // -----------------------------
        // LOAD INVENTORY TABLE
        // -----------------------------
        private void LoadInventory()
        {
            var dt = new DataTable();

            using (var conn = new SqlConnection(ConnStr))
            using (var cmd = new SqlCommand(
                @"SELECT ISBN, CategoryID, Title, Author, Price, InStock, Year, Edition, Publisher 
                  FROM BookData ORDER BY ISBN;", conn))
            using (var da = new SqlDataAdapter(cmd))
            {
                conn.Open();
                da.Fill(dt);
            }

            InventoryGrid.ItemsSource = dt.DefaultView;
        }

        // -----------------------------
        // ADD BOOK
        // -----------------------------
        private void BtnAdd_Click(object sender, RoutedEventArgs e)
        {
            var dlg = new AddBookWindow();
            if (dlg.ShowDialog() == true)
            {
                LoadInventory();
            }
        }

        // -----------------------------
        // EDIT BOOK
        // -----------------------------
        private void BtnEdit_Click(object sender, RoutedEventArgs e)
        {
            if (InventoryGrid.SelectedItem == null)
            {
                MessageBox.Show("Please select a book.");
                return;
            }

            var row = (DataRowView)InventoryGrid.SelectedItem;

            string isbn = row["ISBN"].ToString();
            int categoryId = Convert.ToInt32(row["CategoryID"]);
            string title = row["Title"].ToString();
            string author = row["Author"].ToString();
            decimal price = Convert.ToDecimal(row["Price"]);
            string year = row["Year"].ToString();
            string edition = row["Edition"].ToString();
            string publisher = row["Publisher"].ToString();
            int stock = Convert.ToInt32(row["InStock"]);

            var dlg = new EditBookWindow(isbn, title, author, price, categoryId, year, edition, publisher, stock);

            if (dlg.ShowDialog() == true)
                LoadInventory();
        }

        // -----------------------------
        // DELETE BOOK
        // -----------------------------
        private void BtnDelete_Click(object sender, RoutedEventArgs e)
        {
            if (InventoryGrid.SelectedItem == null)
            {
                MessageBox.Show("Please select a book to delete.");
                return;
            }

            var row = (DataRowView)InventoryGrid.SelectedItem;
            string isbn = row["ISBN"].ToString();

            if (MessageBox.Show("Are you sure you want to delete this book?",
                "Confirm Delete", MessageBoxButton.YesNo,
                MessageBoxImage.Warning) != MessageBoxResult.Yes)
                return;

            using (var conn = new SqlConnection(ConnStr))
            using (var cmd = new SqlCommand("DELETE FROM BookData WHERE ISBN=@I;", conn))
            {
                cmd.Parameters.AddWithValue("@I", isbn);
                conn.Open();
                cmd.ExecuteNonQuery();
            }

            LoadInventory();
        }
    }
}
