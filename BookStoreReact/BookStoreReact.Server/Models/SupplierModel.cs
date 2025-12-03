using System.Text.Json.Serialization;

namespace BookStoreReact.Server.Models
{
    public class SupplierModel
    {
        [JsonPropertyName("SupplierID")] public int SupplierID { get; set; }
        [JsonPropertyName("Name")] public string Name { get; set; } = "";
    }
}
