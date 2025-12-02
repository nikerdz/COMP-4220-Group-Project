using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace BookStoreReact.Server.Models
{
    public class OrderModel
    {
        [JsonPropertyName("OrderID")] public int OrderID { get; set; }
        [JsonPropertyName("UserID")] public int UserID { get; set; }
        [JsonPropertyName("OrderDate")] public DateTime OrderDate { get; set; }
        [JsonPropertyName("TotalAmount")] public decimal TotalAmount { get; set; }
        [JsonPropertyName("SubtotalAmount")] public decimal SubtotalAmount { get; set; }
        [JsonPropertyName("TaxAmount")] public decimal TaxAmount { get; set; }
        [JsonPropertyName("DeliveryFee")] public decimal DeliveryFee { get; set; }
        [JsonPropertyName("Status")] public string Status { get; set; }
        [JsonPropertyName("ShippingAddress")] public string? ShippingAddress { get; set; }
        [JsonPropertyName("PaymentMethod")] public string? PaymentMethod { get; set; }
        [JsonPropertyName("Email")] public string? Email { get; set; }

        // Order Items
        [JsonPropertyName("Items")]
        public List<OrderItemModel> Items { get; set; } = new();
    }
}
