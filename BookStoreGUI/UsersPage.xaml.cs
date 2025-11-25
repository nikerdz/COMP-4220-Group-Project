using System.Data;
using System.Data.SqlClient;
using System.Windows;
using System.Windows.Controls;

namespace BookStoreGUI.Pages
{
    public partial class UsersPage : UserControl
    {
        public UsersPage()
        {
            InitializeComponent();
            LoadUsers();
        }

        private string ConnStr =>
            "Data Source=tfs.cs.uwindsor.ca;Initial Catalog=Agile1422DB25;Persist Security Info=True;" +
            "User ID=Agile1422U25;Password=Agile1422U25$;Encrypt=True;TrustServerCertificate=True";

        private void LoadUsers()
        {
            var dt = new DataTable();

            using (var conn = new SqlConnection(ConnStr))
            using (var cmd = new SqlCommand(
                "SELECT UserID, UserName, Type, Manager, FullName, Email FROM UserData ORDER BY UserID;", conn))
            using (var da = new SqlDataAdapter(cmd))
            {
                conn.Open();
                da.Fill(dt);
            }

            UsersGrid.ItemsSource = dt.DefaultView;
        }

        private void BtnAdd_Click(object sender, RoutedEventArgs e)
        {
            var dlg = new UserAddEditDialog();

            if (dlg.ShowDialog() == true)
            {
                using (var conn = new SqlConnection(ConnStr))
                using (var cmd = new SqlCommand(
                    @"INSERT INTO UserData (UserName, Password, Type, Manager, FullName, Email) 
                      VALUES (@U, @P, @T, @M, @F, @E);", conn))
                {
                    cmd.Parameters.AddWithValue("@U", dlg.Username);
                    cmd.Parameters.AddWithValue("@P", dlg.Password);
                    cmd.Parameters.AddWithValue("@T", dlg.Type);
                    cmd.Parameters.AddWithValue("@M", dlg.IsManager ? 1 : 0);
                    cmd.Parameters.AddWithValue("@F", dlg.FullName);
                    cmd.Parameters.AddWithValue("@E", dlg.Email);

                    conn.Open();
                    cmd.ExecuteNonQuery();
                }

                LoadUsers();
            }
        }

        private void BtnEdit_Click(object sender, RoutedEventArgs e)
        {
            if (UsersGrid.SelectedItem == null)
            {
                MessageBox.Show("Select a user first.");
                return;
            }

            var row = (DataRowView)UsersGrid.SelectedItem;

            int id = (int)row["UserID"];
            string oldU = row["UserName"].ToString();
            string oldT = row["Type"].ToString();
            bool oldM = (bool)row["Manager"];
            string oldF = row["FullName"].ToString();
            string oldE = row["Email"].ToString();

            var dlg = new UserAddEditDialog(oldU, oldT, oldM, oldF, oldE);

            if (dlg.ShowDialog() == true)
            {
                using (var conn = new SqlConnection(ConnStr))
                using (var cmd = new SqlCommand(
                    @"UPDATE UserData 
                      SET UserName=@U, Type=@T, Manager=@M, FullName=@F, Email=@E 
                      WHERE UserID=@ID;", conn))
                {
                    cmd.Parameters.AddWithValue("@U", dlg.Username);
                    cmd.Parameters.AddWithValue("@T", dlg.Type);
                    cmd.Parameters.AddWithValue("@M", dlg.IsManager ? 1 : 0);
                    cmd.Parameters.AddWithValue("@F", dlg.FullName);
                    cmd.Parameters.AddWithValue("@E", dlg.Email);
                    cmd.Parameters.AddWithValue("@ID", id);

                    conn.Open();
                    cmd.ExecuteNonQuery();
                }

                LoadUsers();
            }
        }

        private void BtnDelete_Click(object sender, RoutedEventArgs e)
        {
            if (UsersGrid.SelectedItem == null)
            {
                MessageBox.Show("Select a user first.");
                return;
            }

            var row = (DataRowView)UsersGrid.SelectedItem;
            int id = (int)row["UserID"];

            if (MessageBox.Show("Delete this user?", "Confirm", MessageBoxButton.YesNo) != MessageBoxResult.Yes)
                return;

            using (var conn = new SqlConnection(ConnStr))
            using (var cmd = new SqlCommand("DELETE FROM UserData WHERE UserID=@ID;", conn))
            {
                cmd.Parameters.AddWithValue("@ID", id);
                conn.Open();
                cmd.ExecuteNonQuery();
            }

            LoadUsers();
        }
    }
}
