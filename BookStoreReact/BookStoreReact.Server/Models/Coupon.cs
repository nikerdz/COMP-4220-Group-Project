using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BookStoreReact.Server.Models
{
    public enum DiscountType
    {
        Percentage = 0,
        FixedAmount = 1
    }

    public class Coupon
    {
        public int CouponID { get; set; }
        public string Code { get; set; }
        public string Description { get; set; }
        public decimal DiscountRate { get; set; } // For Percentage: 0.10 = 10%. For Fixed: 5.00 = $5.00
        public DiscountType Type { get; set; } = DiscountType.Percentage;
        public bool IsActive { get; set; }
        public DateTime? StartDate { get; set; }
        public DateTime? EndDate { get; set; }
        public int? UsageLimit { get; set; }
        public int? TimesUsed { get; set; }
        
        // New validation fields
        public decimal? MinimumOrderAmount { get; set; }
        public string? RequiredAuthor { get; set; }
        public string? RequiredCategory { get; set; }

        // Updated validation to accept context
        // We use dynamic or a common interface for items to avoid circular deps if possible, 
        // but here we'll assume we pass the necessary data.
        // Since OrderItemRequest is in Controller, we might need to define a contract or just pass the relevant lists.
        // For simplicity, we'll pass the list of items as a generic list of objects or a specific DTO if available.
        // But since we can't easily see OrderItemRequest here without moving it, let's assume we pass (decimal subtotal, IEnumerable<dynamic> items)
        // OR better, we move OrderItemRequest to Models or duplicate a simple structure.
        // Let's use a simple tuple list for validation: List<(string Author, string Category, decimal Price)>
        
        public bool IsValid(decimal orderSubtotal, IEnumerable<(string Author, string Category, decimal Price)> items)
        {
            if (!IsActive) return false;
            
            var now = DateTime.Now;
            if (StartDate.HasValue && now < StartDate.Value) return false;
            if (EndDate.HasValue && now > EndDate.Value) return false;
            
            if (UsageLimit.HasValue && TimesUsed.HasValue && TimesUsed.Value >= UsageLimit.Value) return false;

            // 1. Minimum Order Amount
            if (MinimumOrderAmount.HasValue && orderSubtotal < MinimumOrderAmount.Value) return false;

            // 2. Specific Products (Author/Category)
            // If RequiredAuthor is set, AT LEAST ONE item must match (or all? usually at least one for the coupon to apply).
            // Let's assume "Coupon for J.K. Rowling books" means you need at least one such book.
            if (!string.IsNullOrWhiteSpace(RequiredAuthor))
            {
                bool hasAuthor = items.Any(i => i.Author != null && i.Author.Equals(RequiredAuthor, StringComparison.OrdinalIgnoreCase));
                if (!hasAuthor) return false;
            }

            if (!string.IsNullOrWhiteSpace(RequiredCategory))
            {
                bool hasCategory = items.Any(i => i.Category != null && i.Category.Equals(RequiredCategory, StringComparison.OrdinalIgnoreCase));
                if (!hasCategory) return false;
            }

            return true;
        }

        // Backward compatibility / Simple check
        public bool ValidateCoupon(Coupon coupon)
        {
            // This method was checking 'coupon' against itself? 
            // The original code passed 'coupon' instance to 'ValidateCoupon'.
            // We'll keep it for basic checks but it's largely redundant if we use IsValid.
            return IsValid(0, new List<(string, string, decimal)>());
        }

        public decimal ApplyDiscount(decimal subtotal)
        {
            decimal discountAmount = 0;

            if (Type == DiscountType.Percentage)
            {
                discountAmount = subtotal * DiscountRate;
            }
            else // FixedAmount
            {
                discountAmount = DiscountRate;
            }

            // "Coupon value should not exceed order value"
            if (discountAmount > subtotal)
            {
                discountAmount = subtotal; // Cap at subtotal (free order)
            }

            return subtotal - discountAmount;
        }
    }
}

