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
            throw new NotImplementedException();
        }

        public decimal ApplyDiscount(decimal subtotal, Coupon coupon)
        {
            throw new NotImplementedException();
        }
    }
}

