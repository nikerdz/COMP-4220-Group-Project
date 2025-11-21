using Microsoft.VisualStudio.TestTools.UnitTesting;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BookStoreLIB
{
    [TestClass]
    public class CouponCartTests
    {
        private Cart cart;
        private Coupon coupon;

        [TestInitialize]
        public void Setup()
        {
            cart = new Cart();
            coupon = new Coupon();
        }

        private decimal CalculateSubtotal()
        {
            decimal subtotal = 0;
            foreach (var book in cart.cartBooks)
            {
                subtotal += book.Subtotal;
            }
            return subtotal;
        }

        // -------------------------------
        // 1. 30% OFF COUPON TEST
        // -------------------------------
        [TestMethod]
        public void ApplyCoupon_30PercentOff_WorksCorrectly()
        {
            // Arrange
            var book1 = new Book { ISBN = "111", Title = "Book A", Price = 50m };
            var book2 = new Book { ISBN = "222", Title = "Book B", Price = 30m };

            cart.addBook(book1);
            cart.addBook(book2);

            var coupon = new Coupon
            {
                Code = "SPRING30",
                DiscountRate = 0.30m,
                IsActive = true,
                StartDate = DateTime.Now.AddDays(-1),
                EndDate = DateTime.Now.AddDays(5)
            };

            decimal subtotal = CalculateSubtotal(); // 80.00

            // Act
            var discounted = coupon.ApplyDiscount(subtotal, coupon);

            // Assert
            Assert.AreEqual(56m, discounted, 0.01m,
                "30% discount should reduce 80.00 subtotal to 56.00.");
        }

        // -------------------------------
        // 2. EXPIRED COUPON FAILS
        // -------------------------------
        [TestMethod]
        public void ApplyCoupon_ExpiredCoupon_ShouldNotApply()
        {
            // Arrange
            cart.addBook(new Book { ISBN = "111", Title = "Book A", Price = 40m });
            decimal subtotal = CalculateSubtotal();

            var coupon = new Coupon
            {
                Code = "WINTER10",
                DiscountRate = 0.10m,
                IsActive = true,
                StartDate = DateTime.Now.AddDays(-10),
                EndDate = DateTime.Now.AddDays(-1) // expired
            };

            // Act
            var isValid = coupon.ValidateCoupon(coupon);

            // Assert
            Assert.IsFalse(isValid, "Expired coupons should be invalid.");
        }

        // -------------------------------
        // 3. INACTIVE COUPON FAILS
        // -------------------------------
        [TestMethod]
        public void ApplyCoupon_InactiveCoupon_ShouldNotApply()
        {
            var coupon = new Coupon
            {
                Code = "BLACKFRIDAY",
                DiscountRate = 0.50m,
                IsActive = false
            };

            // Act
            var isValid = coupon.ValidateCoupon(coupon);

            // Assert
            Assert.IsFalse(isValid, "Inactive coupon should be rejected.");
        }

        // -------------------------------
        // 4. 0% DISCOUNT RETURNS SAME SUBTOTAL
        // -------------------------------
        [TestMethod]
        public void ApplyCoupon_ZeroPercent_ReturnsOriginalSubtotal()
        {
            cart.addBook(new Book { ISBN = "AAA", Title = "Book X", Price = 100m });
            decimal subtotal = CalculateSubtotal();

            var coupon = new Coupon
            {
                Code = "NOCHANGE",
                DiscountRate = 0m,
                IsActive = true
            };

            var discounted = coupon.ApplyDiscount(subtotal, coupon);

            Assert.AreEqual(subtotal, discounted,
                "0% discount should not change subtotal.");
        }

        // -------------------------------
        // 5. PERCENT ROUNDS CORRECTLY
        // -------------------------------
        [TestMethod]
        public void ApplyCoupon_RoundingHandledCorrectly()
        {
            cart.addBook(new Book { ISBN = "555", Price = 99.99m });
            decimal subtotal = CalculateSubtotal();

            var coupon = new Coupon
            {
                Code = "TENOFF",
                DiscountRate = 0.10m,
                IsActive = true
            };

            var discounted = coupon.ApplyDiscount(subtotal, coupon);

            Assert.AreEqual(89.99m, discounted, 0.01m,
                "10% discount should be rounded properly.");
        }
    }
}