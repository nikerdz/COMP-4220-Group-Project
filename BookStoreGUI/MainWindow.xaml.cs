using System;
using System.Collections.Generic;
using System.Data.SqlClient;
using System.Windows;
using System.Windows.Controls;
using System.Windows.Media;
using BookStoreLIB;

namespace BookStoreGUI
{
    public partial class MainWindow : Window
    {
        private UserData userData;
        private List<Book> inventory = new List<Book>();
        private Cart cart = new Cart();

        // ─────────────────────────────────────────────
        // MAIN CONSTRUCTOR
        // ─────────────────────────────────────────────
        public MainWindow()
        {
            InitializeComponent();
        }

        // ─────────────────────────────────────────────
        // WINDOW LOADED EVENT — REQUIRED BY XAML
        // ─────────────────────────────────────────────
        private void Window_Loaded(object sender, RoutedEventArgs e)
        {
            LoadBooks();
            LoadCart();

            ProductsDataGrid.ItemsSource = inventory;
            orderListView.ItemsSource = cart.cartBooks;

            addButton.IsEnabled = false;
            removeButton.IsEnabled = false;
            clearCart.IsEnabled = false;
        }

        // ─────────────────────────────────────────────
        // LOGIN BUTTON
        // ─────────────────────────────────────────────
        private void loginButton_Click(object sender, RoutedEventArgs e)
        {
            userData = new UserData();
            var dlg = new LoginDialog { Owner = this };

            if (dlg.ShowDialog() == true)
            {
                try
                {
                    if (userData.LogIn(dlg.nameTextBox.Text, dlg.passwordTextBox.Password))
                    {
                        statusTextBlock.Text = "You are logged in as: " + userData.LoginName;

                        loginButton.Visibility = Visibility.Collapsed;
                        logoutButton.Visibility = Visibility.Visible;

                        addButton.IsEnabled = true;
                        removeButton.IsEnabled = true;
                        clearCart.IsEnabled = true;

                        // Open admin dashboard if needed
                        if (userData.IsManager || string.Equals(userData.Type, "Admin", StringComparison.OrdinalIgnoreCase))
                        {
                            var dashboard = new AdminDashboard(userData.LoginName) { Owner = this };
                            this.Hide();
                            dashboard.Closed += (_, __) => this.Show();
                            dashboard.Show();
                        }
                    }
                    else
                    {
                        MessageBox.Show("You could not be verified. Please try again.");
                    }
                }
                catch (Exception ex)
                {
                    MessageBox.Show("Login failed: " + ex.Message);
                }
            }
        }

        // ─────────────────────────────────────────────
        // REGISTER BUTTON
        // ─────────────────────────────────────────────
        private void registerButton_Click(object sender, RoutedEventArgs e)
        {
            try
            {
                var dlg = new RegisterDialog { Owner = this };
                var ok = dlg.ShowDialog();

                if (ok == true && !string.IsNullOrEmpty(dlg.CreatedUserName))
                {
                    userData = new UserData();
                    if (userData.LogIn(dlg.CreatedUserName, dlg.CreatedPassword))
                    {
                        statusTextBlock.Text = "You are logged in as: " + userData.LoginName;

                        loginButton.Visibility = Visibility.Collapsed;
                        logoutButton.Visibility = Visibility.Visible;
                        addButton.IsEnabled = true;
                    }
                    else
                    {
                        MessageBox.Show("Registered, but auto-login failed. Please log in manually.");
                    }
                }
            }
            catch (Exception ex)
            {
                MessageBox.Show("Could not open registration: " + ex.Message);
            }
        }

        // ─────────────────────────────────────────────
        // LOGOUT BUTTON
        // ─────────────────────────────────────────────
        private void logoutButton_Click(object sender, RoutedEventArgs e)
        {
            if (cart.cartBooks != null && cart.cartBooks.Count > 0)
            {
                var result = MessageBox.Show(
                    "Your cart is not empty. Clear the cart before logging out?",
                    "Confirm Logout",
                    MessageBoxButton.YesNo,
                    MessageBoxImage.Question);

                if (result == MessageBoxResult.Yes)
                    clearCart_Click(sender, e);
            }

            PerformLogout();
        }

        private void PerformLogout()
        {
            userData = null;
            statusTextBlock.Text = "You have been logged out.";

            loginButton.Visibility = Visibility.Visible;
            logoutButton.Visibility = Visibility.Collapsed;

            addButton.IsEnabled = false;
            removeButton.IsEnabled = false;
            clearCart.IsEnabled = false;

            statusTextBlock.Foreground = Brushes.Black;
        }

        // ─────────────────────────────────────────────
        // EXIT BUTTON
        // ─────────────────────────────────────────────
        private void exitButton_Click(object sender, RoutedEventArgs e)
        {
            this.Close();
        }

        // ─────────────────────────────────────────────
        // REQUIRED SELECTION CHANGED HANDLER
        // (matches XAML)
        // ─────────────────────────────────────────────
        private void ProductsDataGrid_SelectionChanged(object sender, SelectionChangedEventArgs e)
        {
            // Enable Add button only when a book is selected
            addButton.IsEnabled = ProductsDataGrid.SelectedItem != null;
        }

        // ─────────────────────────────────────────────
        // ADD BOOK BUTTON
        // ─────────────────────────────────────────────
        private void addButton_Click(object sender, RoutedEventArgs e)
        {
            Book bookChoice = (Book)ProductsDataGrid.SelectedItem;

            if (bookChoice == null)
            {
                statusTextBlock.Text = "Select a book first.";
                statusTextBlock.Foreground = Brushes.Red;
                return;
            }

            // ----------------------------------------------------
            // 2. Handle PREORDER logic (InStock == 0)
            // ----------------------------------------------------
            if (bookChoice.InStock == 0)
            {
                var result = MessageBox.Show(
                    "This book is currently out of stock.\n\nWould you like to pre-order it?",
                    "Pre-Order Option",
                    MessageBoxButton.YesNo,
                    MessageBoxImage.Question);

                if (result == MessageBoxResult.Yes)
                {
                    bookChoice.PreOrder = true;
                    cart.addBook(bookChoice);
                    updateCart();

                    statusTextBlock.Text = "SUCCESS: Pre-order added to cart!";
                    statusTextBlock.Foreground = Brushes.Green;
                    return; //  Stop normal add logic from running
                }
                else
                {
                    statusTextBlock.Text = "Pre-order canceled.";
                    statusTextBlock.Foreground = Brushes.Red;
                    return; //  Stop normal add logic
                }
            }

            // ----------------------------------------------------
            // 3. Normal ADD logic (InStock > 0)
            // ----------------------------------------------------
            if (cart.addBook(bookChoice))
            {
                updateCart();
                statusTextBlock.Text = "Added to cart!";
                statusTextBlock.Foreground = Brushes.Green;
            }
        }

        // ─────────────────────────────────────────────
        // REMOVE BOOK
        // ─────────────────────────────────────────────
        private void removeButton_Click(object sender, RoutedEventArgs e)
        {
            Book bookChoice = (Book)orderListView.SelectedItem;

            if (bookChoice == null)
            {
                statusTextBlock.Text = "Select a book to remove.";
                statusTextBlock.Foreground = Brushes.Red;
                return;
            }

            if (cart.removeBook(bookChoice))
            {
                updateCart();
                statusTextBlock.Text = "Removed from cart!";
                statusTextBlock.Foreground = Brushes.Green;
            }
        }

        // ─────────────────────────────────────────────
        // CLEAR CART
        // ─────────────────────────────────────────────
        private void clearCart_Click(object sender, RoutedEventArgs e)
        {
            if (cart.cartBooks.Count == 0)
            {
                statusTextBlock.Text = "Cart already empty.";
                statusTextBlock.Foreground = Brushes.Red;
                return;
            }

            cart.clearCart();
            updateCart();

            statusTextBlock.Text = "Cart cleared!";
            statusTextBlock.Foreground = Brushes.Green;
        }

        // ─────────────────────────────────────────────
        // CHECKOUT
        // ─────────────────────────────────────────────
        private void checkoutButton_Click(object sender, RoutedEventArgs e)
        {
            if (cart.cartBooks.Count == 0)
            {
                MessageBox.Show("Your cart is empty.");
                return;
            }

            var checkout = new CheckoutWindow(cart.cartBooks) { Owner = this };
            checkout.ShowDialog();
        }

        // ─────────────────────────────────────────────
        // LOAD BOOKS FROM DB
        // ─────────────────────────────────────────────
        public void LoadBooks()
        {
            string connStr =
                "Data Source=tfs.cs.uwindsor.ca;Initial Catalog=Agile1422DB25;" +
                "Persist Security Info=True;User ID=Agile1422U25;Password=Agile1422U25$;" +
                "Encrypt=True;TrustServerCertificate=True";

            using (var conn = new SqlConnection(connStr))
            {
                conn.Open();
                var cmd = new SqlCommand(
                    "SELECT ISBN, CategoryID, Title, Author, Price, Year, InStock FROM BookData",
                    conn);

                using (var r = cmd.ExecuteReader())
                {
                    inventory.Clear();
                    while (r.Read())
                    {
                        inventory.Add(new Book
                        {
                            ISBN = r.GetString(0),
                            CategoryID = r.GetInt32(1),
                            Title = r.GetString(2),
                            Author = r.GetString(3),
                            Price = r.GetDecimal(4),
                            Year = r.GetString(5),
                            InStock = r.GetInt32(6)
                        });
                    }
                }
            }
        }

        // ─────────────────────────────────────────────
        // LOAD CART
        // ─────────────────────────────────────────────
        public void LoadCart()
        {
            string connStr =
                "Data Source=tfs.cs.uwindsor.ca;Initial Catalog=Agile1422DB25;" +
                "Persist Security Info=True;User ID=Agile1422U25;Password=Agile1422U25$;" +
                "Encrypt=True;TrustServerCertificate=True";

            using (var conn = new SqlConnection(connStr))
            {
                conn.Open();
                var cmd = new SqlCommand("SELECT ISBN, Quantity, Subtotal FROM Cart", conn);

                using (var r = cmd.ExecuteReader())
                {
                    cart.cartBooks.Clear();
                    while (r.Read())
                    {
                        cart.addBook(new Book
                        {
                            ISBN = r.GetString(0),
                            Quantity = r.GetInt32(1),
                            Subtotal = r.GetDecimal(2)
                        });
                    }
                }
            }
        }

        // ─────────────────────────────────────────────
        // UPDATE CART UI
        // ─────────────────────────────────────────────
        private void updateCart()
        {
            orderListView.ItemsSource = null;
            orderListView.ItemsSource = cart.cartBooks;
            GetSubTotal();
        }

        private decimal GetSubTotal()
        {
            decimal subtotal = 0;
            foreach (var book in cart.cartBooks)
                subtotal += book.Price * book.Quantity;

            subtotalTextBlock.Text = $"Subtotal: ${subtotal:F2}";
            return subtotal;
        }
    }
}
