using System;
using System.Windows;
using System.Windows.Controls;
using BookStoreLIB;

namespace BookStoreGUI
{
    public partial class MainWindow : Window
    {
        public MainWindow()
        {
            InitializeComponent();
        }

        private void Window_Loaded(object sender, RoutedEventArgs e)
        {
            // Your team's existing loading logic (categories, data binding, etc.)
        }

        private void loginButton_Click(object sender, RoutedEventArgs e)
        {
            // Existing login logic (your team’s)
        }

        private void logoutButton_Click(object sender, RoutedEventArgs e)
        {
            // Existing logout logic (your team’s)
        }

        private void ProductsDataGrid_SelectionChanged(object sender, SelectionChangedEventArgs e)
        {
            // Existing product selection logic (your team’s)
        }

        private void addButton_Click(object sender, RoutedEventArgs e)
        {
            // Existing add-to-cart logic
        }

        private void removeButton_Click(object sender, RoutedEventArgs e)
        {
            // Existing remove-from-cart logic
        }

        private void clearCart_Click(object sender, RoutedEventArgs e)
        {
            // Existing clear-cart logic
        }

        private void checkoutButton_Click(object sender, RoutedEventArgs e)
        {
            // Existing checkout logic
        }

        private void exitButton_Click(object sender, RoutedEventArgs e)
        {
            Application.Current.Shutdown();
        }

        // ---------------------------
        // ✅ REGISTER BUTTON (your addition)
        // ---------------------------
        private void registerButton_Click(object sender, RoutedEventArgs e)
        {
            try
            {
                // Open your Register Dialog
                RegisterDialog registerDialog = new RegisterDialog();
                registerDialog.Owner = this;  // Centers dialog on MainWindow
                bool? result = registerDialog.ShowDialog();

                if (result == true)
                {
                    MessageBox.Show("New user registered successfully!",
                                    "Registration Complete",
                                    MessageBoxButton.OK,
                                    MessageBoxImage.Information);
                }
            }
            catch (Exception ex)
            {
                MessageBox.Show("An error occurred while opening registration:\n" + ex.Message,
                                "Error",
                                MessageBoxButton.OK,
                                MessageBoxImage.Error);
            }
        }
    }
}
