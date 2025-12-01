namespace BookStoreReact.Server.Models
{
    public class WishlistModel
    {
        public int WishlistID { get; set; }
        public int UserID { get; set; }
        public string ISBN { get; set; }
        public DateTime DateAdded { get; set; }
        public string Title { get; set; }
        public string Author { get; set; }
        public decimal Price { get; set; }
    }
}