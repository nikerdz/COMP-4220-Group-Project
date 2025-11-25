using System.Data;
using System.Data.SqlClient;
using System.Windows;
using System.Windows.Controls;

namespace BookStoreGUI.Pages
{
    public partial class SuppliersPage : UserControl
    {
        public SuppliersPage()
        {
            InitializeComponent();
            LoadSuppliers();
        }

        private string ConnStr =>
            "Data Source=tfs.cs.uwindsor.ca;Initial Catalog=Agile1422DB25;Persist Security Info=True;" +
            "User ID=Agile1422U25;Password=Agile1422U25$;Encrypt=True;TrustServerCertificate=True";

        private void LoadSuppliers()
        {
            var dt = new DataTable();

            using (var conn = new SqlConnection(ConnStr))
            using (var cmd = new SqlCommand("SELECT SupplierId, Name FROM Supplier ORDER BY SupplierId;", conn))
            using (var da = new SqlDataAdapter(cmd))
            {
                conn.Open();
                da.Fill(dt);
            }

            SuppliersGrid.ItemsSource = dt.DefaultView;
        }

        private void BtnAdd_Click(object sender, RoutedEventArgs e)
        {
            var dlg = new SupplierAddEditDialog();

            if (dlg.ShowDialog() == true)
            {
                using (var conn = new SqlConnection(ConnStr))
                using (var cmd = new SqlCommand(
                    "INSERT INTO Supplier (SupplierId, Name) " +
                    "VALUES ((SELECT ISNULL(MAX(SupplierId),0)+1 FROM Supplier), @N);", conn))
                {
                    cmd.Parameters.AddWithValue("@N", dlg.SupplierName);
                    conn.Open();
                    cmd.ExecuteNonQuery();
                }

                LoadSuppliers();
            }
        }

        private void BtnEdit_Click(object sender, RoutedEventArgs e)
        {
            if (SuppliersGrid.SelectedItem == null)
            {
                MessageBox.Show("Select a supplier first.");
                return;
            }

            var row = (DataRowView)SuppliersGrid.SelectedItem;
            int id = (int)row["SupplierId"];
            string oldName = row["Name"].ToString();

            var dlg = new SupplierAddEditDialog(oldName);

            if (dlg.ShowDialog() == true)
            {
                using (var conn = new SqlConnection(ConnStr))
                using (var cmd = new SqlCommand(
                    "UPDATE Supplier SET Name=@N WHERE SupplierId=@ID;", conn))
                {
                    cmd.Parameters.AddWithValue("@N", dlg.SupplierName);
                    cmd.Parameters.AddWithValue("@ID", id);
                    conn.Open();
                    cmd.ExecuteNonQuery();
                }

                LoadSuppliers();
            }
        }

        private void BtnDelete_Click(object sender, RoutedEventArgs e)
        {
            if (SuppliersGrid.SelectedItem == null)
            {
                MessageBox.Show("Select a supplier first.");
                return;
            }

            var row = (DataRowView)SuppliersGrid.SelectedItem;
            int id = (int)row["SupplierId"];

            if (MessageBox.Show("Are you sure you want to delete this supplier?", "Confirm",
                MessageBoxButton.YesNo) != MessageBoxResult.Yes)
                return;

            using (var conn = new SqlConnection(ConnStr))
            using (var cmd = new SqlCommand("DELETE FROM Supplier WHERE SupplierId=@ID;", conn))
            {
                cmd.Parameters.AddWithValue("@ID", id);
                conn.Open();
                cmd.ExecuteNonQuery();
            }

            LoadSuppliers();
        }
    }
}
