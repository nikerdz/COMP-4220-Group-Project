namespace BookStoreReact.Server.Models
{
    public class DashboardStatsModel
    {
        public int TotalUsers { get; set; }
        public int TotalOrders { get; set; }
        public int PendingOrders { get; set; }
        public int TotalBooks { get; set; }
        public int TotalSuppliers { get; set; }
    }
}
