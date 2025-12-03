using System.Text.Json.Serialization;

public class BookModel
{
    [JsonPropertyName("isbn")]
    public string ISBN { get; set; }

    [JsonPropertyName("categoryID")]
    public int CategoryID { get; set; }

    [JsonPropertyName("supplierId")]
    public int? SupplierId { get; set; }

    [JsonPropertyName("title")]
    public string Title { get; set; }

    [JsonPropertyName("author")]
    public string Author { get; set; }

    [JsonPropertyName("price")]
    public decimal Price { get; set; }

    [JsonPropertyName("year")]
    public string? Year { get; set; }

    [JsonPropertyName("edition")]
    public string Edition { get; set; }

    [JsonPropertyName("publisher")]
    public string? Publisher { get; set; }

    [JsonPropertyName("inStock")]
    public int InStock { get; set; }

    [JsonPropertyName("supplierName")]
    public string? SupplierName { get; set; }
}
