using System;

namespace BookStoreReact.Server.Models
{
    /// <summary>
    /// Represents an individual item (book) within an order
    /// </summary>
    public class OrderItem
    {
        public int OrderItemID { get; set; }
        public int OrderID { get; set; }
        public required string ISBN { get; set; }
        public string? Title { get; set; }
        public string? Author { get; set; }
        public decimal Price { get; set; }
        public int Quantity { get; set; }
        public decimal Subtotal { get; set; }

        /// <summary>
        /// Calculates the subtotal based on price and quantity
        /// </summary>
        public void UpdateSubtotal()
        {
            Subtotal = Price * Quantity;
        }
    }
}
