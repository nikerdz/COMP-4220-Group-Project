namespace BookStoreReact.Server.Models
{
    public class UserAdminModel
    {
        public int UserID { get; set; }

        // REQUIRED fields (backend validates them)
        public string UserName { get; set; } = string.Empty;
        public string Password { get; set; } = string.Empty;
        public string Type { get; set; } = string.Empty;   // "AD" or "CU"

        // OPTIONAL fields
        public bool Manager { get; set; }
        public string? FullName { get; set; }
        public string? Email { get; set; }
    }
}
