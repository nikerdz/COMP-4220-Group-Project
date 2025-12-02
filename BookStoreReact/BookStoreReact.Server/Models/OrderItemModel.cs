namespace BookStoreReact.Server.Models
{
    public class OrderItemModel
    {
        public string? ISBN { get; set; }
        public string? Title { get; set; }
        public decimal Price { get; set; }
        public int Quantity { get; set; }
    }
}
