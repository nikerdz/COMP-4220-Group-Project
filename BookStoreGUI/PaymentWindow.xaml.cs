using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Windows;
using System.Windows.Controls;
using System.Windows.Data;
using System.Windows.Documents;
using System.Windows.Input;
using System.Windows.Media;
using System.Windows.Media.Imaging;
using System.Windows.Shapes;
using System.Net.Mail;

namespace BookStoreGUI
{
    /// <summary>
    /// Interaction logic for PaymentWindow.xaml
    /// </summary>
    public partial class PaymentWindow : Window
    {
        public PaymentWindow() // In here we only only put setup code
        {
            InitializeComponent(); // Loads everything we defined in the XAML
        }
        private void btnPay_Click(object sender, RoutedEventArgs e)
        {
            // optional to add: 
            // Gmail has to have the @ sign

            string name = txtCardName.Text;
            string number = txtCardNumber.Text;
            string expiry = txtExpiry.Text;
            string cvv = txtCVV.Password;
            string email = txtEmail.Text;

            // If any of the fields are empty return error message

            if (string.IsNullOrWhiteSpace(name) || string.IsNullOrWhiteSpace(number) ||
               string.IsNullOrWhiteSpace(expiry) || string.IsNullOrWhiteSpace(cvv) ||
               string.IsNullOrWhiteSpace(email))
            {
                MessageBox.Show("Please fill in all fields.", "Missing Info", MessageBoxButton.OK, MessageBoxImage.Warning);
                return;
            }

            if (cvv.Length != 3 || number.Length != 16 || !expiry.Contains("/"))
            {
                MessageBox.Show("Please check card details.");
                return;
            }

            try
            {
                _ = new System.Net.Mail.MailAddress(email); // This line uses .NET’s built-in class MailAddress to check is the email is valid or not 
            }
            catch
            {
                MessageBox.Show("Invalid email.");
                return;
            }

        }

    }
}
