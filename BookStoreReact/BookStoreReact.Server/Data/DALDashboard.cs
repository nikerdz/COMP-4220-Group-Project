using System.Data;
using System.Data.SqlClient;
using BookStoreReact.Server.Models;

namespace BookStoreReact.Server.Data
{
    public class DALDashboard
    {
        private readonly string _connStr;

        public DALDashboard(IConfiguration config)
        {
            _connStr = config.GetConnectionString("DefaultConnection");
        }

        public DashboardStatsModel GetStats()
        {
            DashboardStatsModel stats = new();

            using SqlConnection conn = new SqlConnection(_connStr);
            conn.Open();

            // 1) Total Users
            using (SqlCommand cmd = new SqlCommand("SELECT COUNT(*) FROM UserData", conn))
                stats.TotalUsers = Convert.ToInt32(cmd.ExecuteScalar());

            // 2) Total Orders
            using (SqlCommand cmd = new SqlCommand("SELECT COUNT(*) FROM OrderData", conn))
                stats.TotalOrders = Convert.ToInt32(cmd.ExecuteScalar());

            // 3) Pending Orders
            using (SqlCommand cmd = new SqlCommand(
                "SELECT COUNT(*) FROM OrderData WHERE Status='Pending'", conn))
                stats.PendingOrders = Convert.ToInt32(cmd.ExecuteScalar());

            // 4) Total Books
            using (SqlCommand cmd = new SqlCommand("SELECT COUNT(*) FROM BookData", conn))
                stats.TotalBooks = Convert.ToInt32(cmd.ExecuteScalar());

            // 5) Suppliers
            using (SqlCommand cmd = new SqlCommand("SELECT COUNT(*) FROM Supplier", conn))
                stats.TotalSuppliers = Convert.ToInt32(cmd.ExecuteScalar());

            return stats;
        }
    }
}
