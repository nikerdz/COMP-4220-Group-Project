using System;
using System.Collections.Generic;
using Xunit;
using BookStoreReact.Server.Models;
using BookStoreReact.Server.Data;

namespace BookStoreReact.Server.Tests
{
    public class OrderTests
    {
        // NOTE: These tests require database connection
        // Set environment variables before running:
        // AGILE_DB_USER and AGILE_DB_PASSWORD

        [Fact]
        public void Order_CreateNew_SetsDefaultDate()
        {
            // Arrange & Act
            var order = new Order();

            // Assert
            Assert.NotEqual(default(DateTime), order.OrderDate);
            Assert.Equal("Pending", order.Status);
        }

        [Fact]
        public void OrderItem_UpdateSubtotal_CalculatesCorrectly()
        {
            // Arrange
            var item = new OrderItem
            {
                Price = 19.99m,
                Quantity = 3
            };

            // Act
            item.UpdateSubtotal();

            // Assert
            Assert.Equal(59.97m, item.Subtotal);
        }

        [Fact]
        public void Order_ItemsCollection_InitializesEmpty()
        {
            // Arrange & Act
            var order = new Order();

            // Assert
            Assert.NotNull(order.Items);
            Assert.Empty(order.Items);
        }

        [Fact]
        public void OrderItem_WithMultipleQuantity_SubtotalIsCorrect()
        {
            // Arrange
            var item = new OrderItem
            {
                Price = 25.00m,
                Quantity = 4
            };

            // Act
            item.UpdateSubtotal();

            // Assert
            Assert.Equal(100.00m, item.Subtotal);
        }

        [Fact]
        public void Order_SetProperties_AllPropertiesWork()
        {
            // Arrange
            var order = new Order
            {
                UserID = 1,
                TotalAmount = 100.50m,
                SubtotalAmount = 89.00m,
                TaxAmount = 11.50m,
                DeliveryFee = 0.00m,
                Status = "Processing",
                ShippingAddress = "123 Test St",
                PaymentMethod = "**** 1234",
                Email = "test@example.com"
            };

            // Assert
            Assert.Equal(1, order.UserID);
            Assert.Equal(100.50m, order.TotalAmount);
            Assert.Equal(89.00m, order.SubtotalAmount);
            Assert.Equal(11.50m, order.TaxAmount);
            Assert.Equal(0.00m, order.DeliveryFee);
            Assert.Equal("Processing", order.Status);
            Assert.Equal("123 Test St", order.ShippingAddress);
            Assert.Equal("**** 1234", order.PaymentMethod);
            Assert.Equal("test@example.com", order.Email);
        }

        [Fact]
        public void OrderItem_SetProperties_AllPropertiesWork()
        {
            // Arrange
            var item = new OrderItem
            {
                OrderID = 1,
                ISBN = "978-0134685991",
                Title = "Effective Java",
                Author = "Joshua Bloch",
                Price = 34.99m,
                Quantity = 2,
                Subtotal = 69.98m
            };

            // Assert
            Assert.Equal(1, item.OrderID);
            Assert.Equal("978-0134685991", item.ISBN);
            Assert.Equal("Effective Java", item.Title);
            Assert.Equal("Joshua Bloch", item.Author);
            Assert.Equal(34.99m, item.Price);
            Assert.Equal(2, item.Quantity);
            Assert.Equal(69.98m, item.Subtotal);
        }

        // Integration tests (require database)
        // Uncomment these after setting up environment variables

        /*
        [Fact]
        public void DALOrder_CreateOrder_ThrowsOnNullOrder()
        {
            // Arrange
            var dal = new DALOrder();
            var items = new List<OrderItem>();

            // Act & Assert
            Assert.Throws<ArgumentNullException>(() => dal.CreateOrder(null, items));
        }

        [Fact]
        public void DALOrder_CreateOrder_ThrowsOnEmptyItems()
        {
            // Arrange
            var dal = new DALOrder();
            var order = new Order { UserID = 1, TotalAmount = 100 };
            var items = new List<OrderItem>();

            // Act & Assert
            Assert.Throws<ArgumentException>(() => dal.CreateOrder(order, items));
        }

        [Fact]
        public void DALOrder_CreateOrder_ReturnsValidOrderId()
        {
            // Arrange
            var dal = new DALOrder();
            var order = new Order
            {
                UserID = 1,
                OrderDate = DateTime.UtcNow,
                SubtotalAmount = 34.99m,
                TaxAmount = 4.55m,
                DeliveryFee = 0.00m,
                TotalAmount = 39.54m,
                Status = "Pending",
                Email = "test@example.com"
            };

            var items = new List<OrderItem>
            {
                new OrderItem
                {
                    ISBN = "978-TEST",
                    Title = "Test Book",
                    Author = "Test Author",
                    Price = 34.99m,
                    Quantity = 1,
                    Subtotal = 34.99m
                }
            };

            // Act
            int orderId = dal.CreateOrder(order, items);

            // Assert
            Assert.True(orderId > 0);
        }
        */
    }
}
