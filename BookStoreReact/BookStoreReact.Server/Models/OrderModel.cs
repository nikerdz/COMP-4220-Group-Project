namespace BookStoreReact.Server.Models
{
    public class OrderModel
    {
        public int OrderID { get; set; }
        public int UserID { get; set; }
        public string? UserName { get; set; }
        public string? OrderDate { get; set; }
        public decimal TotalAmount { get; set; }
        public string? Status { get; set; }
    }
}
