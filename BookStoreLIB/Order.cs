using System;
using System.Collections.Generic;

namespace BookStoreLIB
{
    /// <summary>
    /// Represents a customer order in the bookstore system
    /// </summary>
    public class Order
    {
        public int OrderID { get; set; }
        public int UserID { get; set; }
        public DateTime OrderDate { get; set; }
        public decimal TotalAmount { get; set; }
        public decimal SubtotalAmount { get; set; }
        public decimal TaxAmount { get; set; }
        public decimal DeliveryFee { get; set; }
        public string Status { get; set; } = "Pending";
        public string ShippingAddress { get; set; }
        public string PaymentMethod { get; set; } // Last 4 digits of card
        public string Email { get; set; }

        // Navigation property - not stored in DB but useful for object model
        public List<OrderItem> Items { get; set; } = new List<OrderItem>();

        public Order()
        {
            OrderDate = DateTime.UtcNow;
        }
    }
}
