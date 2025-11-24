using System.Windows;
using System.Windows.Controls;

namespace BookStoreGUI.Pages
{
    public partial class UserAddEditDialog : Window
    {
        public string Username => TxtUsername.Text.Trim();
        public string Password => TxtPassword.Password.Trim();
        public string Type => (CmbType.SelectedItem as ComboBoxItem)?.Content.ToString();
        public bool IsManager => ChkManager.IsChecked == true;
        public string FullName => TxtFullName.Text.Trim();
        public string Email => TxtEmail.Text.Trim();

        public UserAddEditDialog(
            string username = "", string type = "", bool manager = false,
            string fullname = "", string email = "")
        {
            InitializeComponent();

            TxtUsername.Text = username;
            TxtFullName.Text = fullname;
            TxtEmail.Text = email;
            ChkManager.IsChecked = manager;

            // Pre-select correct type
            if (!string.IsNullOrWhiteSpace(type))
            {
                foreach (ComboBoxItem item in CmbType.Items)
                {
                    if (item.Content.ToString() == type)
                    {
                        CmbType.SelectedItem = item;
                        break;
                    }
                }
            }
            else
            {
                CmbType.SelectedIndex = 0; // default AD
            }
        }

        private void Ok_Click(object sender, RoutedEventArgs e)
        {
            if (string.IsNullOrWhiteSpace(Username))
            {
                MessageBox.Show("Username is required.");
                return;
            }

            if (CmbType.SelectedItem == null)
            {
                MessageBox.Show("Please select a user type.");
                return;
            }

            DialogResult = true;
        }

        private void Cancel_Click(object sender, RoutedEventArgs e)
        {
            DialogResult = false;
        }
    }
}
