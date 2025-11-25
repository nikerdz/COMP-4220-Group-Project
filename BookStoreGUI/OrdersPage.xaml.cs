using System;
using System.Data;
using System.Data.SqlClient;
using System.Windows;
using System.Windows.Controls;

namespace BookStoreGUI.Pages
{
    public partial class OrdersPage : UserControl
    {
        public OrdersPage()
        {
            InitializeComponent();
            LoadOrders();
        }

        private string ConnStr =>
            "Data Source=tfs.cs.uwindsor.ca;Initial Catalog=Agile1422DB25;Persist Security Info=True;User ID=Agile1422U25;Password=Agile1422U25$;Encrypt=True;TrustServerCertificate=True";

        // -------------------------------
        // LOAD ORDERS
        // -------------------------------
        private void LoadOrders()
        {
            try
            {
                var dt = new DataTable();

                using (var conn = new SqlConnection(ConnStr))
                using (var cmd = new SqlCommand("SELECT * FROM OrderData ORDER BY OrderID DESC;", conn))
                using (var da = new SqlDataAdapter(cmd))
                {
                    conn.Open();
                    da.Fill(dt);
                }

                OrdersGrid.ItemsSource = dt.DefaultView;
            }
            catch (Exception ex)
            {
                MessageBox.Show("Failed to load orders:\n" + ex.Message);
            }
        }

        // -------------------------------
        // LOAD ORDER ITEMS
        // -------------------------------
        private void LoadOrderItems(int orderId)
        {
            try
            {
                var dt = new DataTable();

                using (var conn = new SqlConnection(ConnStr))
                using (var cmd = new SqlCommand("SELECT * FROM OrderItems WHERE OrderID=@ID;", conn))
                using (var da = new SqlDataAdapter(cmd))
                {
                    cmd.Parameters.AddWithValue("@ID", orderId);
                    conn.Open();
                    da.Fill(dt);
                }

                OrderItemsGrid.ItemsSource = dt.DefaultView;
            }
            catch (Exception ex)
            {
                MessageBox.Show("Failed to load order items:\n" + ex.Message);
            }
        }

        // -------------------------------
        // SELECT ORDER → LOAD ITEMS
        // -------------------------------
        private void OrdersGrid_SelectionChanged(object sender, SelectionChangedEventArgs e)
        {
            if (OrdersGrid.SelectedItem == null)
                return;

            var row = (DataRowView)OrdersGrid.SelectedItem;
            int orderId = (int)row["OrderID"];

            LoadOrderItems(orderId);

            // preload dropdown with current status
            string status = row["Status"].ToString();
            StatusDropdown.SelectedItem =
                new ComboBoxItem { Content = status };
        }

        // -------------------------------
        // UPDATE STATUS
        // -------------------------------
        private void BtnUpdateStatus_Click(object sender, RoutedEventArgs e)
        {
            if (OrdersGrid.SelectedItem == null)
            {
                MessageBox.Show("Select an order first.");
                return;
            }

            var row = (DataRowView)OrdersGrid.SelectedItem;
            int orderId = (int)row["OrderID"];

            if (StatusDropdown.SelectedItem is ComboBoxItem item)
            {
                string newStatus = item.Content.ToString();

                using (var conn = new SqlConnection(ConnStr))
                using (var cmd = new SqlCommand(
                    "UPDATE OrderData SET Status=@S WHERE OrderID=@ID;", conn))
                {
                    cmd.Parameters.AddWithValue("@S", newStatus);
                    cmd.Parameters.AddWithValue("@ID", orderId);

                    conn.Open();
                    cmd.ExecuteNonQuery();
                }

                LoadOrders();
                LoadOrderItems(orderId);

                MessageBox.Show("Order status updated.");
            }
        }

        // -------------------------------
        // REFRESH BUTTON
        // -------------------------------
        private void BtnRefresh_Click(object sender, RoutedEventArgs e)
        {
            LoadOrders();
            OrderItemsGrid.ItemsSource = null;
        }
    }
}
