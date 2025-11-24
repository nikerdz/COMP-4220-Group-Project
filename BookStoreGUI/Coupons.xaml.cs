using System;
using System.Data;
using System.Data.SqlClient;
using System.Windows;
using System.Windows.Controls;
using static System.Runtime.CompilerServices.RuntimeHelpers;

namespace BookStoreGUI.Pages
{
    public partial class CouponsPage : UserControl
    {
        public CouponsPage()
        {
            InitializeComponent();
            LoadCoupons();
        }

        private string ConnStr =>
            "Data Source=tfs.cs.uwindsor.ca;Initial Catalog=Agile1422DB25;Persist Security Info=True;User ID=Agile1422U25;Password=Agile1422U25$;Encrypt=True;TrustServerCertificate=True";

        private void LoadCoupons()
        {
            var dt = new DataTable();

            using (var conn = new SqlConnection(ConnStr))
            using (var cmd = new SqlCommand("SELECT * FROM Coupon ORDER BY CouponID;", conn))
            using (var da = new SqlDataAdapter(cmd))
            {
                conn.Open();
                da.Fill(dt);
            }

            CouponsGrid.ItemsSource = dt.DefaultView;
        }

        private void BtnAdd_Click(object sender, RoutedEventArgs e)
        {
            using (var conn = new SqlConnection(ConnStr))
            using (var cmd = new SqlCommand(
                @"INSERT INTO Coupon 
                  (CouponID, Code, Description, DiscountRate, UsageLimit, TimesUsed, StartDate, EndDate, IsActive)
                  VALUES ((SELECT ISNULL(MAX(CouponID),0)+1 FROM Coupon),
                          @C, @D, @DR, @UL, @TU, @SD, @ED, @A);", conn))
            {
                cmd.Parameters.AddWithValue("@C", TxtCode.Text.Trim());
                cmd.Parameters.AddWithValue("@D", TxtDescription.Text.Trim());
                cmd.Parameters.AddWithValue("@DR", decimal.Parse(TxtDiscountRate.Text));
                cmd.Parameters.AddWithValue("@UL", int.Parse(TxtUsageLimit.Text));
                cmd.Parameters.AddWithValue("@TU", int.Parse(TxtTimesUsed.Text));
                cmd.Parameters.AddWithValue("@SD", StartDatePicker.SelectedDate);
                cmd.Parameters.AddWithValue("@ED", EndDatePicker.SelectedDate);
                cmd.Parameters.AddWithValue("@A", ChkIsActive.IsChecked ?? false);

                conn.Open();
                cmd.ExecuteNonQuery();
            }

            LoadCoupons();
        }

        private void BtnEdit_Click(object sender, RoutedEventArgs e)
        {
            if (CouponsGrid.SelectedItem == null)
            {
                MessageBox.Show("Select a coupon first.");
                return;
            }

            var row = (DataRowView)CouponsGrid.SelectedItem;
            int id = (int)row["CouponID"];

            using (var conn = new SqlConnection(ConnStr))
            using (var cmd = new SqlCommand(
                @"UPDATE Coupon SET
                    Code=@C, Description=@D, DiscountRate=@DR,
                    UsageLimit=@UL, TimesUsed=@TU,
                    StartDate=@SD, EndDate=@ED, IsActive=@A
                  WHERE CouponID=@ID;", conn))
            {
                cmd.Parameters.AddWithValue("@ID", id);
                cmd.Parameters.AddWithValue("@C", TxtCode.Text.Trim());
                cmd.Parameters.AddWithValue("@D", TxtDescription.Text.Trim());
                cmd.Parameters.AddWithValue("@DR", decimal.Parse(TxtDiscountRate.Text));
                cmd.Parameters.AddWithValue("@UL", int.Parse(TxtUsageLimit.Text));
                cmd.Parameters.AddWithValue("@TU", int.Parse(TxtTimesUsed.Text));
                cmd.Parameters.AddWithValue("@SD", StartDatePicker.SelectedDate);
                cmd.Parameters.AddWithValue("@ED", EndDatePicker.SelectedDate);
                cmd.Parameters.AddWithValue("@A", ChkIsActive.IsChecked ?? false);

                conn.Open();
                cmd.ExecuteNonQuery();
            }

            LoadCoupons();
        }

        private void BtnDelete_Click(object sender, RoutedEventArgs e)
        {
            if (CouponsGrid.SelectedItem == null)
            {
                MessageBox.Show("Select a coupon to delete.");
                return;
            }

            var row = (DataRowView)CouponsGrid.SelectedItem;
            int id = (int)row["CouponID"];

            if (MessageBox.Show("Delete this coupon?", "Confirm Delete",
                    MessageBoxButton.YesNo) != MessageBoxResult.Yes)
                return;

            using (var conn = new SqlConnection(ConnStr))
            using (var cmd = new SqlCommand("DELETE FROM Coupon WHERE CouponID=@ID;", conn))
            {
                cmd.Parameters.AddWithValue("@ID", id);
                conn.Open();
                cmd.ExecuteNonQuery();
            }

            LoadCoupons();
        }
    }
}
