using Microsoft.VisualStudio.TestTools.UnitTesting;
using System;
using System.Collections.Generic;
using System.Linq;
using BookStoreLIB;

namespace BookStoreLIB.Tests
{
    [TestClass]
    public class PaymentWindowTesting
    {
        private static List<Book> CreateCart(params (decimal price, int qty, string title)[] items)
        {
            var list = new List<Book>();
            int i = 1;
            foreach (var it in items)
            {
                list.Add(new Book
                {
                    ISBN = $"ISBN{i++}",
                    Title = it.title,
                    Price = it.price,
                    Quantity = it.qty,
                    Author = "Author",
                    Year = "2000"
                });
            }
            return list;
        }

        [TestMethod]
        public void EmptyForm_ShouldPreventPayment()
        {
            var required = new Dictionary<string, string>
            {
                { "Cardholder Name", "" },
                { "Card Number", "" },
                { "Expiry", "" },
                { "CVV", "" },
                { "Email", "" }
            };

            var missing = PaymentRules.GetMissingFields(required);

            Assert.IsTrue(missing.Any(), "Expected missing required fields.");
            CollectionAssert.AreEquivalent(new[] { "Cardholder Name", "Card Number", "Expiry", "CVV", "Email" }, missing);
        }

        [TestMethod]
        public void PartiallyEmptyForm_ShouldIdentifyWhichOnes()
        {
            var required = new Dictionary<string, string>
            {
                { "Cardholder Name", "Test User" },
                { "Card Number", "4111111111111111" }, // Visa test number (passes Luhn)
                { "Expiry", "12/30" },
                { "CVV", "" },                         // missing
                { "Email", "" }                        // missing
            };

            var missing = PaymentRules.GetMissingFields(required);
            Assert.AreEqual(2, missing.Count);
            CollectionAssert.AreEquivalent(new[] { "CVV", "Email" }, missing);
        }

        [TestMethod]
        public void EmailValidation_ShouldRejectBadEmails()
        {
            var bads = new[] { null, "", "a", "user@", "@domain.com", "user@domain", "user@.com" };
            foreach (var s in bads)
                Assert.IsFalse(PaymentRules.IsValidEmail(s), $"Expected invalid: {s}");

            Assert.IsTrue(PaymentRules.IsValidEmail("test@example.com"));
        }

        [TestMethod]
        public void CardValidation_ShouldEnforce16Digits_AndLuhn()
        {
            Assert.IsFalse(PaymentRules.IsValidCardNumber("123"));                 // too short
            Assert.IsFalse(PaymentRules.IsValidCardNumber("12345678901234567"));   // too long
            Assert.IsFalse(PaymentRules.IsValidCardNumber("1111111111111111"));    // fails Luhn

            // Common Visa test number (16 digits, passes Luhn)
            Assert.IsTrue(PaymentRules.IsValidCardNumber("4111111111111111"));
        }

        [TestMethod]
        public void CVVValidation_ShouldBe3Digits()
        {
            Assert.IsFalse(PaymentRules.IsValidCVV(null));
            Assert.IsFalse(PaymentRules.IsValidCVV(""));
            Assert.IsFalse(PaymentRules.IsValidCVV("1"));
            Assert.IsFalse(PaymentRules.IsValidCVV("12"));
            Assert.IsFalse(PaymentRules.IsValidCVV("1234"));
            Assert.IsFalse(PaymentRules.IsValidCVV("12a"));
            Assert.IsTrue(PaymentRules.IsValidCVV("123"));
        }

        [TestMethod]
        public void ExpiryValidation_ShouldRequire_MMYY_AndNotExpired()
        {
            var nowUtc = new DateTime(2025, 10, 30, 12, 0, 0, DateTimeKind.Utc);

            // Bad formats
            foreach (var bad in new[] { "", "13/25", "00/25", "1/25", "12-25", "1225", "ab/cd" })
                Assert.IsFalse(PaymentRules.IsValidExpiry(bad, nowUtc), $"Expected invalid: {bad}");

            // Expired: 09/25 is before end-of-month of Sept 2025
            Assert.IsFalse(PaymentRules.IsValidExpiry("09/25", nowUtc));

            // Valid: current/future months
            Assert.IsTrue(PaymentRules.IsValidExpiry("10/25", nowUtc)); // same month is OK (end-of-month semantics)
            Assert.IsTrue(PaymentRules.IsValidExpiry("12/25", nowUtc));
            Assert.IsTrue(PaymentRules.IsValidExpiry("01/26", nowUtc));
        }

        [TestMethod]
        public void Totals_ShouldMatch_Subtotal_Tax_Delivery()
        {
            var cart = CreateCart((10.00m, 2, "A"), (5.00m, 1, "B")); // subtotal = 25.00
            var (subtotal, taxes, total) = PaymentRules.ComputeTotals(cart, taxRate: 0.13m, deliveryFee: 5.00m);

            Assert.AreEqual(25.00m, subtotal);
            Assert.AreEqual(Math.Round(25.00m * 0.13m, 2), taxes);
            Assert.AreEqual(25.00m + taxes + 5.00m, total);
        }

        [TestMethod]
        public void OrderSummary_ShouldRenderExpectedShape()
        {
            var cart = CreateCart((12.34m, 1, "Clean Code"), (20.00m, 2, "Design Patterns"));
            var (subtotal, taxes, total) = PaymentRules.ComputeTotals(cart, 0.13m, 5.00m);

            var now = new DateTime(2025, 10, 30, 12, 34, 56);
            var summary = PaymentSummaryBuilder.BuildOrderSummary(cart, subtotal, taxes, 5.00m, total, now);

            StringAssert.Contains(summary, "=== ORDER CONFIRMED ===");
            StringAssert.Contains(summary, "Order Date: 2025-10-30 12:34:56");
            StringAssert.Contains(summary, "ITEMS ORDERED:");
            StringAssert.Contains(summary, "Clean Code\t1\t$12.34");
            StringAssert.Contains(summary, "Design Patterns\t2\t$40.00");
            StringAssert.Contains(summary, $"SUBTOTAL:\t\t${subtotal:F2}");
            StringAssert.Contains(summary, $"TAX (13%):\t\t${taxes:F2}");
            StringAssert.Contains(summary, "DELIVERY FEE:\t\t$5.00");
            StringAssert.Contains(summary, $"TOTAL:\t\t\t${total:F2}");
            StringAssert.Contains(summary, "Thank you for your order!");
        }

        [TestMethod]
        public void HappyPath_ValidForm_ShouldPassAllValidationRules()
        {
            // Simulate what your PaymentWindow validates.
            var fields = new Dictionary<string, string>
            {
                { "Cardholder Name", "Ada Lovelace" },
                { "Card Number", "4111111111111111" },
                { "Expiry", "12/26" },
                { "CVV", "123" },
                { "Email", "ada@example.com" }
            };

            var missing = PaymentRules.GetMissingFields(fields);
            Assert.AreEqual(0, missing.Count);

            Assert.IsTrue(PaymentRules.IsValidEmail(fields["Email"]));
            Assert.IsTrue(PaymentRules.IsValidCardNumber(fields["Card Number"]));
            Assert.IsTrue(PaymentRules.IsValidCVV(fields["CVV"]));
            Assert.IsTrue(PaymentRules.IsValidExpiry(fields["Expiry"], DateTime.UtcNow));
        }
    }
}
