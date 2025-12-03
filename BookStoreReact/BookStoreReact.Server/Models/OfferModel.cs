using System.Text.Json.Serialization;

namespace BookStoreReact.Server.Models
{
    public class OfferModel
    {
        [JsonPropertyName("CouponID")] public int CouponID { get; set; }
        [JsonPropertyName("Code")] public string Code { get; set; } = "";
        [JsonPropertyName("Description")] public string? Description { get; set; }
        [JsonPropertyName("DiscountRate")] public decimal DiscountRate { get; set; }
        [JsonPropertyName("UsageLimit")] public int? UsageLimit { get; set; }
        [JsonPropertyName("TimesUsed")] public int TimesUsed { get; set; }
        [JsonPropertyName("StartDate")] public DateTime? StartDate { get; set; }
        [JsonPropertyName("EndDate")] public DateTime? EndDate { get; set; }
        [JsonPropertyName("IsActive")] public bool IsActive { get; set; }
    }
}
