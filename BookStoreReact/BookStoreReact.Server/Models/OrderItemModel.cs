using System.Text.Json.Serialization;

namespace BookStoreReact.Server.Models
{
    public class OrderItemModel
    {
        [JsonPropertyName("OrderItemID")] public int OrderItemID { get; set; }
        [JsonPropertyName("OrderID")] public int OrderID { get; set; }
        [JsonPropertyName("ISBN")] public string ISBN { get; set; }
        [JsonPropertyName("Title")] public string? Title { get; set; }
        [JsonPropertyName("Price")] public decimal Price { get; set; }
        [JsonPropertyName("Quantity")] public int Quantity { get; set; }
        [JsonPropertyName("Subtotal")] public decimal Subtotal { get; set; }
    }
}
