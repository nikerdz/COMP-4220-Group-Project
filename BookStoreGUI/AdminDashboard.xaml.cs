using System.Windows;

namespace BookStoreGUI
{
    public partial class AdminDashboard : Window
    {
        private readonly string _loginName;

        // Single constructor; always initialize XAML first
        public AdminDashboard(string username)
        {
            InitializeComponent();                    
            _loginName = string.IsNullOrWhiteSpace(username) ? "admin" : username;
            TxtCurrentUser.Text = $"Admin: {_loginName}";

            // Optional: show a default landing view so the content area isn’t empty
            ContentHost.Content = BuildWelcome();
        }

        private UIElement BuildWelcome()
        {
            return new System.Windows.Controls.TextBlock
            {
                Text = "Welcome! Pick a section on the left (Inventory, Categories, Offers, Orders).",
                Margin = new Thickness(24),
                FontSize = 16
            };
        }

        private void BtnLogout_Click(object sender, RoutedEventArgs e)
        {
            Close();
        }

        private void NavInventory_Click(object sender, RoutedEventArgs e)
        {
            ContentHost.Content = new System.Windows.Controls.TextBlock
            {
                Text = "Inventory — coming soon.",
                Margin = new Thickness(24)
            };
        }

        private void NavCategories_Click(object sender, RoutedEventArgs e)
        {
            ContentHost.Content = new System.Windows.Controls.TextBlock
            {
                Text = "Categories — coming soon.",
                Margin = new Thickness(24)
            };
        }

        private void NavOffers_Click(object sender, RoutedEventArgs e)
        {
            ContentHost.Content = new System.Windows.Controls.TextBlock
            {
                Text = "Offers — coming soon.",
                Margin = new Thickness(24)
            };
        }

        private void NavOrders_Click(object sender, RoutedEventArgs e)
        {
            ContentHost.Content = new System.Windows.Controls.TextBlock
            {
                Text = "Orders — coming soon.",
                Margin = new Thickness(24)
            };
        }
    }
}
