namespace BookStoreReact.Server.Models
{
    public class OfferModel
    {
        public int OfferId { get; set; }
        public string? Code { get; set; }
        public string? Description { get; set; }
        public int DiscountPercent { get; set; }
        public bool Active { get; set; }
        public string? ExpiryDate { get; set; }   // yyyy-MM-dd or null
    }
}
