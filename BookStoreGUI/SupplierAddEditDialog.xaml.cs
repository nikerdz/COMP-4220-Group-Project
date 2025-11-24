using System.Windows;

namespace BookStoreGUI.Pages
{
    public partial class SupplierAddEditDialog : Window
    {
        public string SupplierName => TxtName.Text.Trim();

        public SupplierAddEditDialog(string existingName = "")
        {
            InitializeComponent();
            TxtName.Text = existingName;
        }

        private void Ok_Click(object sender, RoutedEventArgs e)
        {
            if (string.IsNullOrWhiteSpace(TxtName.Text))
            {
                MessageBox.Show("Please enter a valid supplier name.");
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
