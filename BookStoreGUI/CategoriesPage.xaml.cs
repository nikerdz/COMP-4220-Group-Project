using System.Data;
using System.Data.SqlClient;
using System.Windows;
using System.Windows.Controls;

namespace BookStoreGUI.Pages
{
    public partial class CategoriesPage : UserControl
    {
        public CategoriesPage()
        {
            InitializeComponent();
            LoadCategories();
        }

        private string ConnStr =>
            "Data Source=tfs.cs.uwindsor.ca;Initial Catalog=Agile1422DB25;Persist Security Info=True;" +
            "User ID=Agile1422U25;Password=Agile1422U25$;Encrypt=True;TrustServerCertificate=True";

        private void LoadCategories()
        {
            var dt = new DataTable();

            using (var conn = new SqlConnection(ConnStr))
            using (var cmd = new SqlCommand("SELECT CategoryID, Name FROM Category ORDER BY CategoryID;", conn))
            using (var da = new SqlDataAdapter(cmd))
            {
                conn.Open();
                da.Fill(dt);
            }

            CategoriesGrid.ItemsSource = dt.DefaultView;
        }

        private void BtnAdd_Click(object sender, RoutedEventArgs e)
        {
            var dlg = new CategoryAddEditDialog();
            if (dlg.ShowDialog() == true)
            {
                using (var conn = new SqlConnection(ConnStr))
                using (var cmd = new SqlCommand(
                    "INSERT INTO Category (CategoryID, Name) " +
                    "VALUES ((SELECT ISNULL(MAX(CategoryID),0)+1 FROM Category), @N);", conn))
                {
                    cmd.Parameters.AddWithValue("@N", dlg.CategoryName);
                    conn.Open();
                    cmd.ExecuteNonQuery();
                }

                LoadCategories();
            }
        }

        private void BtnEdit_Click(object sender, RoutedEventArgs e)
        {
            if (CategoriesGrid.SelectedItem == null)
            {
                MessageBox.Show("Select a category first.");
                return;
            }

            var row = (DataRowView)CategoriesGrid.SelectedItem;
            int id = (int)row["CategoryID"];
            string oldName = row["Name"].ToString();

            var dlg = new CategoryAddEditDialog(oldName);
            if (dlg.ShowDialog() == true)
            {
                using (var conn = new SqlConnection(ConnStr))
                using (var cmd = new SqlCommand(
                    "UPDATE Category SET Name=@N WHERE CategoryID=@ID;", conn))
                {
                    cmd.Parameters.AddWithValue("@N", dlg.CategoryName);
                    cmd.Parameters.AddWithValue("@ID", id);
                    conn.Open();
                    cmd.ExecuteNonQuery();
                }

                LoadCategories();
            }
        }

        private void BtnDelete_Click(object sender, RoutedEventArgs e)
        {
            if (CategoriesGrid.SelectedItem == null)
            {
                MessageBox.Show("Select a category first.");
                return;
            }

            var row = (DataRowView)CategoriesGrid.SelectedItem;
            int id = (int)row["CategoryID"];

            if (MessageBox.Show("Are you sure you want to delete this category?", "Confirm",
                MessageBoxButton.YesNo) != MessageBoxResult.Yes)
                return;

            using (var conn = new SqlConnection(ConnStr))
            using (var cmd = new SqlCommand("DELETE FROM Category WHERE CategoryID=@ID;", conn))
            {
                cmd.Parameters.AddWithValue("@ID", id);
                conn.Open();
                cmd.ExecuteNonQuery();
            }

            LoadCategories();
        }
    }
}
