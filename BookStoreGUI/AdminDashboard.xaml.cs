using System.Windows;

namespace BookStoreGUI
{
    public partial class AdminDashboard : Window
    {
        private readonly string _login;

        public AdminDashboard(string username)
        {
            InitializeComponent();
            _login = string.IsNullOrWhiteSpace(username) ? "admin" : username;
            TxtCurrentUser.Text = $"Admin: {_login}";

            // Default landing text
            ContentHost.Content = new System.Windows.Controls.TextBlock
            {
                Text = "Select a section from the left menu.",
                Margin = new Thickness(20),
                FontSize = 16
            };
        }

        private void BtnLogout_Click(object sender, RoutedEventArgs e)
        {
            Close();
        }

        private void NavInventory_Click(object sender, RoutedEventArgs e)
        {
            ContentHost.Content = new Pages.InventoryPage();
        }

        private void NavCategories_Click(object sender, RoutedEventArgs e)
        {
            ContentHost.Content = new Pages.CategoriesPage();
        }

        private void NavOffers_Click(object sender, RoutedEventArgs e)
        {
            ContentHost.Content = new Pages.CouponsPage();
        }

        private void NavUsers_Click(object sender, RoutedEventArgs e)
        {
            ContentHost.Content = new Pages.UsersPage();
        }

        private void NavOrders_Click(object sender, RoutedEventArgs e)
        {
            ContentHost.Content = new Pages.OrdersPage();
        }

        private void NavSuppliers_Click(object sender, RoutedEventArgs e)
        {
            ContentHost.Content = new BookStoreGUI.Pages.SuppliersPage();
        }
    }
}
