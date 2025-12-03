using System.Text.Json.Serialization;

namespace BookStoreReact.Server.Models
{
    public class UserAdminModel
    {
        [JsonPropertyName("UserID")] public int UserID { get; set; }
        [JsonPropertyName("UserName")] public string UserName { get; set; } = string.Empty;
        [JsonPropertyName("Password")] public string? Password { get; set; }   // only used on ADD
        [JsonPropertyName("FullName")] public string? FullName { get; set; }
        [JsonPropertyName("Email")] public string? Email { get; set; }
        [JsonPropertyName("Type")] public string Type { get; set; } = "AD";   // ALWAYS AD
        [JsonPropertyName("Manager")] public bool Manager { get; set; }
    }
}
