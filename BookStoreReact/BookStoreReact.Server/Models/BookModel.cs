namespace BookStoreReact.Server.Models

{
    public class BookModel
    {
        public string ISBN { get; set; }
        public int CategoryID { get; set; }
        public int? SupplierId { get; set; }
        public string Title { get; set; }
        public string Author { get; set; }
        public decimal Price { get; set; }
        public string? Year { get; set; }
        public string Edition { get; set; }
        public string? Publisher { get; set; }
        public int InStock { get; set; }
        public string? SupplierName { get; set; } // computed
    }
}
