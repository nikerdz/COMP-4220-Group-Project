using System;
using System.Data;
using System.Data.SqlClient;
using System.Windows;

namespace BookStoreGUI.Pages
{
    public partial class EditBookWindow : Window
    {
        private readonly string _isbn;
        private readonly string ConnStr =
            "Data Source=tfs.cs.uwindsor.ca;Initial Catalog=Agile1422DB25;" +
            "Persist Security Info=True;User ID=Agile1422U25;Password=Agile1422U25$;" +
            "Encrypt=True;TrustServerCertificate=True";

        public EditBookWindow(string isbn, string title, string author, decimal price,
                              int categoryId, string year, string edition,
                              string publisher, int stock)
        {
            InitializeComponent();
            _isbn = isbn;

            LoadCategories();
            CategoryDropdown.SelectedValue = categoryId;

            TxtTitle.Text = title;
            TxtAuthor.Text = author;
            TxtPrice.Text = price.ToString();
            TxtYear.Text = year;
            TxtEdition.Text = edition;
            TxtPublisher.Text = publisher;
            TxtStock.Text = stock.ToString();
        }

        private void LoadCategories()
        {
            var dt = new DataTable();

            using (var conn = new SqlConnection(ConnStr))
            using (var cmd = new SqlCommand("SELECT CategoryID, Name FROM Category ORDER BY CategoryID;", conn))
            using (var da = new SqlDataAdapter(cmd))
            {
                conn.Open();
                da.Fill(dt);
            }

            CategoryDropdown.ItemsSource = dt.DefaultView;
        }

        private void BtnCancel_Click(object sender, RoutedEventArgs e)
        {
            DialogResult = false;
            Close();
        }

        private void BtnSave_Click(object sender, RoutedEventArgs e)
        {
            try
            {
                if (CategoryDropdown.SelectedValue == null)
                {
                    MessageBox.Show("Select a category.");
                    return;
                }

                using (var conn = new SqlConnection(ConnStr))
                using (var cmd = new SqlCommand(
                    @"UPDATE BookData SET 
                        CategoryID=@C, Title=@T, Author=@A, Price=@P,
                        Year=@Y, Edition=@E, Publisher=@PUB, InStock=@S
                      WHERE ISBN=@I;", conn))
                {
                    cmd.Parameters.AddWithValue("@I", _isbn);
                    cmd.Parameters.AddWithValue("@C", (int)CategoryDropdown.SelectedValue);
                    cmd.Parameters.AddWithValue("@T", TxtTitle.Text.Trim());
                    cmd.Parameters.AddWithValue("@A", TxtAuthor.Text.Trim());
                    cmd.Parameters.AddWithValue("@P", Convert.ToDecimal(TxtPrice.Text));
                    cmd.Parameters.AddWithValue("@Y", TxtYear.Text.Trim());
                    cmd.Parameters.AddWithValue("@E", TxtEdition.Text.Trim());
                    cmd.Parameters.AddWithValue("@PUB", TxtPublisher.Text.Trim());
                    cmd.Parameters.AddWithValue("@S", Convert.ToInt32(TxtStock.Text));

                    conn.Open();
                    cmd.ExecuteNonQuery();
                }

                DialogResult = true;
                Close();
            }
            catch (Exception ex)
            {
                MessageBox.Show("Error saving changes:\n" + ex.Message);
            }
        }
    }
}
