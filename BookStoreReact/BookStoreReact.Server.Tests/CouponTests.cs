using System;
using Xunit;
using BookStoreReact.Server.Models;

namespace BookStoreReact.Server.Tests
{
    public class CouponTests
    {
        [Fact]
        public void ValidateCoupon_ReturnsTrue_ForValidCoupon()
        {
            // Arrange
            var coupon = new Coupon
            {
                Code = "TEST10",
                IsActive = true,
                StartDate = DateTime.Now.AddDays(-1),
                EndDate = DateTime.Now.AddDays(1),
                UsageLimit = 100,
                TimesUsed = 0
            };
            var instance = new Coupon();

            // Act
            var result = instance.ValidateCoupon(coupon);

            // Assert
            Assert.True(result);
        }

        [Fact]
        public void ValidateCoupon_ReturnsFalse_ForExpiredCoupon()
        {
            // Arrange
            var coupon = new Coupon
            {
                Code = "EXPIRED",
                IsActive = true,
                StartDate = DateTime.Now.AddDays(-10),
                EndDate = DateTime.Now.AddDays(-1),
                UsageLimit = 100,
                TimesUsed = 0
            };
            var instance = new Coupon();

            // Act
            var result = instance.ValidateCoupon(coupon);

            // Assert
            Assert.False(result);
        }

        [Fact]
        public void ValidateCoupon_ReturnsFalse_ForInactiveCoupon()
        {
            // Arrange
            var coupon = new Coupon
            {
                Code = "INACTIVE",
                IsActive = false,
                StartDate = DateTime.Now.AddDays(-1),
                EndDate = DateTime.Now.AddDays(1),
                UsageLimit = 100,
                TimesUsed = 0
            };
            var instance = new Coupon();

            // Act
            var result = instance.ValidateCoupon(coupon);

            // Assert
            Assert.False(result);
        }

        [Fact]
        public void ValidateCoupon_ReturnsFalse_WhenUsageLimitExceeded()
        {
            // Arrange
            var coupon = new Coupon
            {
                Code = "LIMIT",
                IsActive = true,
                StartDate = DateTime.Now.AddDays(-1),
                EndDate = DateTime.Now.AddDays(1),
                UsageLimit = 5,
                TimesUsed = 5
            };
            var instance = new Coupon();

            // Act
            var result = instance.ValidateCoupon(coupon);

            // Assert
            Assert.False(result);
        }

        [Fact]
        public void ApplyDiscount_CalculatesCorrectly()
        {
            // Arrange
            var coupon = new Coupon
            {
                Code = "SAVE20",
                DiscountRate = 0.20m,
                IsActive = true,
                StartDate = DateTime.Now.AddDays(-1),
                EndDate = DateTime.Now.AddDays(1)
            };
            var instance = new Coupon();
            decimal subtotal = 100.00m;

            // Act
            var newSubtotal = instance.ApplyDiscount(subtotal, coupon);

            // Assert
            Assert.Equal(80.00m, newSubtotal);
        }

        [Fact]
        public void ApplyDiscount_ReturnsOriginalSubtotal_IfCouponInvalid()
        {
            // Arrange
            var coupon = new Coupon
            {
                Code = "INVALID",
                DiscountRate = 0.20m,
                IsActive = false // Invalid
            };
            var instance = new Coupon();
            decimal subtotal = 100.00m;

            // Act
            var newSubtotal = instance.ApplyDiscount(subtotal, coupon);

            // Assert
            Assert.Equal(100.00m, newSubtotal);
        }
    }
}
