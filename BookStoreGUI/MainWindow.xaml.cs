/* **********************************************************************************
 * For use by students taking 60-422 (Fall, 2014) to work on assignments and project.
 * Permission required material. Contact: xyuan@uwindsor.ca 
 * **********************************************************************************/

using System;
using System.Windows;
using BookStoreLIB;

namespace BookStoreGUI
{
    /// Interaction logic for MainWindow.xaml
    public partial class MainWindow : Window
    {
        private void registerButton_Click(object sender, RoutedEventArgs e)
        {
            // Placeholder message
            MessageBox.Show("Register button clicked - Next implement backend logic", "Info", MessageBoxButton.OK, MessageBoxImage.Information);
        }

        private void loginButton_Click(object sender, RoutedEventArgs e)
        {
            var userData = new UserData();
            var dlg = new LoginDialog();
            dlg.Owner = this;
            dlg.ShowDialog();

            if (dlg.DialogResult == true)
            {
                try
                {
                    if (userData.LogIn(dlg.nameTextBox.Text, dlg.passwordTextBox.Password))
                    {
                        this.statusTextBlock.Text = "You are logged in as User #" + userData.UserID;
                    }
                    else
                    {
                        MessageBox.Show("You could not be verified. Please try again.");
                    }
                }
                catch (ArgumentException ex)
                {
                    MessageBox.Show(ex.Message); // show validation errors
                }
            }
        }

        private void exitButton_Click(object sender, RoutedEventArgs e) { this.Close(); }
        public MainWindow() { InitializeComponent(); }
        private void Window_Loaded(object sender, RoutedEventArgs e) { }
        private void addButton_Click(object sender, RoutedEventArgs e) { }
        private void chechoutButton_Click(object sender, RoutedEventArgs e) { }
    }
}