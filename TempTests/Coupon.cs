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
            
            var now = DateTime.UtcNow;
            // Note: Tests use DateTime.Now, so we should match that or use a time provider. 
            // For simplicity in this context, we'll use DateTime.Now to match the test setup.
            now = DateTime.Now; 

            if (coupon.StartDate.HasValue && now < coupon.StartDate.Value) return false;
            if (coupon.EndDate.HasValue && now > coupon.EndDate.Value) return false;
            
            if (coupon.UsageLimit.HasValue && coupon.TimesUsed.HasValue && coupon.TimesUsed.Value >= coupon.UsageLimit.Value) return false;

            return true;
        }

        public decimal ApplyDiscount(decimal subtotal, Coupon coupon)
        {
            if (!ValidateCoupon(coupon)) return subtotal; // Should return original subtotal if invalid, based on test "ZeroPercent_ReturnsOriginalSubtotal" logic implication? 
            // Wait, the test "InactiveCoupon_ShouldNotApply" checks ValidateCoupon directly.
            // The test "ZeroPercent_ReturnsOriginalSubtotal" expects subtotal back.
            // If I return 0, the subtotal calculation in the controller (subtotal -= discount) would mean no discount, which is correct.
            // BUT, the test "ApplyDiscount_ZeroPercent_ReturnsOriginalSubtotal" asserts:
            // "Assert.AreEqual(subtotal, discounted)"
            // This implies ApplyDiscount returns the *new subtotal* or the *discounted amount*?
            // Let's check the test: "var discounted = coupon.ApplyDiscount(subtotal, coupon);" -> "Assert.AreEqual(subtotal, discounted)"
            // This implies ApplyDiscount returns the **FINAL PRICE**, not the discount amount.
            
            // Let's re-read the test carefully.
            // Test 1: "Assert.AreEqual(56m, discounted)" where subtotal was 80 and discount 30%. 80 * 0.7 = 56.
            // So ApplyDiscount returns the NEW TOTAL.
            
            return subtotal - (subtotal * coupon.DiscountRate);
        }
    }
}

