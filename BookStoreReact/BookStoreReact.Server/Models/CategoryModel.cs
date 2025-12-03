using System.Text.Json.Serialization;

namespace BookStoreReact.Server.Models
{
    public class CategoryModel
    {
        [JsonPropertyName("CategoryID")] public int CategoryID { get; set; }
        [JsonPropertyName("Name")] public string? Name { get; set; }
        [JsonPropertyName("Description")] public string? Description { get; set; }
    }
}
