using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BookStoreLIB
{
    public class Coupon
    {
        public int CouponID { get; set; }
        public string Code { get; set; }
        public decimal DiscountRate { get; set; }
        public bool IsActive { get; set; }
        public DateTime? StartDate { get; set; }
        public DateTime? EndDate { get; set; }
        public int? UsageLimit { get; set; }
        public int? TimesUsed { get; set; }

        public bool ValidateCoupon(Coupon coupon)
        {
            if (coupon == null) return false;
            if (!coupon.IsActive) return false;
            
            // Use DateTime.Now to match test expectations, though UtcNow is usually better for servers.
            var now = DateTime.Now; 

            if (coupon.StartDate.HasValue && now < coupon.StartDate.Value) return false;
            if (coupon.EndDate.HasValue && now > coupon.EndDate.Value) return false;
            
            if (coupon.UsageLimit.HasValue && coupon.TimesUsed.HasValue && coupon.TimesUsed.Value >= coupon.UsageLimit.Value) return false;

            return true;
        }

        public decimal ApplyDiscount(decimal subtotal, Coupon coupon)
        {
            if (!ValidateCoupon(coupon)) return subtotal;
            
            // Returns the NEW subtotal (discounted price)
            return subtotal - (subtotal * coupon.DiscountRate);
        }
    }
}

