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
        private TextBlock statusTextBlock;

        public MainWindow()
        {
            InitializeComponent();
            statusTextBlock = this.FindName("statusTextBlock") as TextBlock;

            try
            {
                LoadBooks();
                LoadCart();
                ProductsDataGrid.ItemsSource = inventory;
                orderListView.ItemsSource = cart.cartBooks;
            }
            catch (Exception ex)
            {
                MessageBox.Show("Error initializing application: " + ex.Message, "Error", MessageBoxButton.OK, MessageBoxImage.Error);
            }
        }

        private void Window_Loaded(object sender, RoutedEventArgs e)
        {
            addButton.IsEnabled = false;
            removeButton.IsEnabled = false;
            clearCart.IsEnabled = false;
        }

        // REGISTER
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
                MessageBox.Show("Could not open registration: " + ex.Message, "Error", MessageBoxButton.OK, MessageBoxImage.Error);
            }
        }

        // LOGIN
        private void loginButton_Click(object sender, RoutedEventArgs e)
        {
            var dlg = new LoginDialog { Owner = this };
            var ok = dlg.ShowDialog();

            if (ok == true)
            {
                try
                {
                    userData = new UserData();
                    if (userData.LogIn(dlg.nameTextBox.Text, dlg.passwordTextBox.Password))
                    {
                        statusTextBlock.Text = "You are logged in as: " + userData.LoginName;

                        loginButton.Visibility = Visibility.Collapsed;
                        logoutButton.Visibility = Visibility.Visible;

                        addButton.IsEnabled = true;
                        removeButton.IsEnabled = true;
                        clearCart.IsEnabled = true;

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
                    MessageBox.Show(ex.Message, "Validation error", MessageBoxButton.OK, MessageBoxImage.Warning);
                }
                catch (Exception ex)
                {
                    MessageBox.Show("Login error: " + ex.Message, "Error", MessageBoxButton.OK, MessageBoxImage.Error);
                }
            }
        }

        // LOGOUT (asks to clear cart if not empty)
        private void logoutButton_Click(object sender, RoutedEventArgs e)
        {
            try
            {
                if (cart != null && cart.cartBooks != null && cart.cartBooks.Count > 0)
                {
                    var result = MessageBox.Show(
                        "Your cart is not empty. Would you like to clear the cart before logging out?",
                        "Confirm Logout", MessageBoxButton.YesNo, MessageBoxImage.Question);

                    if (result == MessageBoxResult.Yes)
                    {
                        cart.clearCart();
                        updateCart();
                    }
                }

                PerformLogout();
            }
            catch (Exception ex)
            {
                MessageBox.Show("Logout failed: " + ex.Message, "Error", MessageBoxButton.OK, MessageBoxImage.Error);
            }

        private void PerformLogout()
        {
            userData = null;
            statusTextBlock.Text = "You have been logged out.";
            statusTextBlock.Foreground = Brushes.Black;
            loginButton.Visibility = Visibility.Visible;
            logoutButton.Visibility = Visibility.Collapsed;
            addButton.IsEnabled = false;
            removeButton.IsEnabled = false;
            clearCart.IsEnabled = false;

            statusTextBlock.Foreground = Brushes.Black;
        }

        // SELECTION changed for products grid
        private void ProductsDataGrid_SelectionChanged(object sender, SelectionChangedEventArgs e)
        {
            // keep logic minimal - enable add button if an item is selected
            addButton.IsEnabled = ProductsDataGrid.SelectedItem != null;
        }

        // ADD to cart
        private void addButton_Click(object sender, RoutedEventArgs e)
        {
            var bookChoice = ProductsDataGrid.SelectedItem as Book;
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
            var bookChoice = orderListView.SelectedItem as Book;
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

        private void checkoutButton_Click(object sender, RoutedEventArgs e)
        {
            try
            {
                if (cart == null || cart.cartBooks == null || cart.cartBooks.Count == 0)
                {
                    MessageBox.Show("Your cart is empty.", "Checkout", MessageBoxButton.OK, MessageBoxImage.Information);
                    return;
                }

                var checkout = new CheckoutWindow(cart.cartBooks) { Owner = this };
                checkout.ShowDialog();
            }
            catch (Exception ex)
            {
                MessageBox.Show("Failed to open checkout: " + ex.Message, "Error", MessageBoxButton.OK, MessageBoxImage.Error);
            }
        }

        private void adminButton_Click(object sender, RoutedEventArgs e)
        {
            // open admin dashboard if user is manager - additional checks can be added
            if (userData != null && (userData.IsManager || string.Equals(userData.Type, "Admin", StringComparison.OrdinalIgnoreCase)))
            {
                var dashboard = new AdminDashboard(userData.LoginName) { Owner = this };
                this.Hide();
                dashboard.Closed += (_, __) => this.Show();
                dashboard.Show();
            }
        }

        private void exitButton_Click(object sender, RoutedEventArgs e)
        {
            this.Close();
        }

        // Load inventory from DB
        public void LoadBooks()
        {
            inventory.Clear();
            var connString = "Data Source=tfs.cs.uwindsor.ca;Initial Catalog=Agile1422DB25;Persist Security Info=True;User ID=Agile1422U25;Password=Agile1422U25$;Encrypt=True;TrustServerCertificate=True";
            using (var conn1 = new SqlConnection(connString))
            {
                conn1.Open();
                var sql = "SELECT ISBN, CategoryID, Title, Author, Price, Year, InStock FROM BookData";
                using (var cmd = new SqlCommand(sql, conn1))
                using (var reader = cmd.ExecuteReader())
                {
                    while (reader.Read())
                    {
                        var book = new Book
                        {
                            ISBN = reader.GetString(0),
                            CategoryID = reader.GetInt32(1),
                            Title = reader.GetString(2),
                            Author = reader.GetString(3),
                            Price = reader.GetDecimal(4),
                            Year = reader.GetString(5),
                            InStock = reader.GetInt32(6)
                        };
                        inventory.Add(book);
                    }
                }
            }
        }

        // Load cart from DB (basic)
        public void LoadCart()
        {
            cart = new Cart(); // start fresh
            var connString = "Data Source=tfs.cs.uwindsor.ca;Initial Catalog=Agile1422DB25;Persist Security Info=True;User ID=Agile1422U25;Password=Agile1422U25$;Encrypt=True;TrustServerCertificate=True";
            using (var conn2 = new SqlConnection(connString))
            {
                conn2.Open();
                var sql = "SELECT ISBN, Quantity, Subtotal FROM Cart";
                using (var cmd = new SqlCommand(sql, conn2))
                using (var reader = cmd.ExecuteReader())
                {
                    while (reader.Read())
                    {
                        var book = new Book
                        {
                            ISBN = reader.GetString(0),
                        };

                        // If Book has Quantity/Subtotal properties in your BookStoreLIB, set them; otherwise adapt cart.addBook signature.
                        try
                        {
                            var qty = reader.GetInt32(1);
                            var subtotal = reader.GetDecimal(2);
                            // if Book has Quantity and Subtotal:
                            // book.Quantity = qty;
                            // book.Subtotal = subtotal;
                        }
                        catch
                        {
                            // ignore if columns/types differ
                        }

                        cart.addBook(book);
                    }
                }
            }
        }

        private decimal GetSubTotal()
        {
            decimal subtotal = 0;
            foreach (var book in cart.cartBooks)
            {
                subtotal += book.Price * book.Quantity;
            }
            subtotalTextBlock.Text = $"Subtotal: ${subtotal:F2}";
            return subtotal;
        }

        private void updateCart()
        {
            orderListView.ItemsSource = null;
            orderListView.ItemsSource = cart.cartBooks;
            GetSubTotal();
        }
    }
}
