using System;
using System.Collections.Generic;
using Microsoft.Data.SqlClient;
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
            DashboardStatsModel stats = new DashboardStatsModel();

            using (SqlConnection conn = new SqlConnection(_connStr))
            {
                conn.Open();

                // TOTAL USERS  
                stats.TotalUsers = ExecuteScalar(conn, "SELECT COUNT(*) FROM UserData");

                // TOTAL ORDERS
                stats.TotalOrders = ExecuteScalar(conn, "SELECT COUNT(*) FROM OrderData");

                // PENDING ORDERS
                stats.PendingOrders = ExecuteScalar(conn, "SELECT COUNT(*) FROM OrderData WHERE Status='Pending'");

                // BOOK INVENTORY COUNT
                stats.TotalBooks = ExecuteScalar(conn, "SELECT COUNT(*) FROM BookData");

                // SUPPLIERS COUNT
                stats.TotalSuppliers = ExecuteScalar(conn, "SELECT COUNT(*) FROM Supplier");
            }

            return stats;
        }

        private int ExecuteScalar(SqlConnection conn, string query)
        {
            try
            {
                SqlCommand cmd = new SqlCommand(query, conn);
                object? result = cmd.ExecuteScalar();

                if (result == null || result == DBNull.Value)
                    return 0;

                return Convert.ToInt32(result);
            }
            catch
            {
                // prevents dashboard crash — logs can be added if needed
                return 0;
            }
        }
    }
}
