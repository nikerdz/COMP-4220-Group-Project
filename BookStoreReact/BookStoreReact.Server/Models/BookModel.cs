using System.Text.Json.Serialization;

public class BookModel
{
    [JsonPropertyName("ISBN")]
    public string ISBN { get; set; }

    [JsonPropertyName("CategoryID")]
    public int CategoryID { get; set; }

    [JsonPropertyName("SupplierId")]
    public int? SupplierId { get; set; }

    [JsonPropertyName("Title")]
    public string Title { get; set; }

    [JsonPropertyName("Author")]
    public string Author { get; set; }

    [JsonPropertyName("Price")]
    public decimal Price { get; set; }

    [JsonPropertyName("Year")]
    public string Year { get; set; }

    [JsonPropertyName("Edition")]
    public string Edition { get; set; }

    [JsonPropertyName("Publisher")]
    public string Publisher { get; set; }

    [JsonPropertyName("InStock")]
    public int InStock { get; set; }

    [JsonPropertyName("SupplierName")]
    public string? SupplierName { get; set; }
}
