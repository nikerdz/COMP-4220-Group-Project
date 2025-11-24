using System.Windows;

namespace BookStoreGUI.Pages
{
    public partial class CategoryAddEditDialog : Window
    {
        public string CategoryName => TxtName.Text.Trim();

        public CategoryAddEditDialog(string existingName = "")
        {
            InitializeComponent();
            TxtName.Text = existingName;
        }

        private void Ok_Click(object sender, RoutedEventArgs e)
        {
            if (string.IsNullOrWhiteSpace(TxtName.Text))
            {
                MessageBox.Show("Please enter a valid category name.");
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
