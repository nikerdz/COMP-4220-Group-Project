using System.Text.Json.Serialization;

namespace BookStoreReact.Server.Models
{
    public class OrderAdminModel
    {
        [JsonPropertyName("OrderID")] public int OrderID { get; set; }
        [JsonPropertyName("UserID")] public int UserID { get; set; }
        [JsonPropertyName("OrderDate")] public DateTime OrderDate { get; set; }
        [JsonPropertyName("TotalAmount")] public decimal TotalAmount { get; set; }
        [JsonPropertyName("Status")] public string Status { get; set; } = "";
        [JsonPropertyName("PaymentMethod")] public string? PaymentMethod { get; set; }
    }
}
