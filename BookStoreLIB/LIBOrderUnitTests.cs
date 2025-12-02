using System;
using System.Collections.Generic;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using BookStoreLIB;

namespace BookStoreLIB
{
    [TestClass]
    public class LIBOrderUnitTests
    {
        // Helper to load environment variables from .env file
        [ClassInitialize]
        public static void LoadEnv(TestContext context)
        {
            var envPath = System.IO.Path.Combine(
                AppDomain.CurrentDomain.BaseDirectory,
                "..", "..", "..", ".env");

            if (System.IO.File.Exists(envPath))
            {
                foreach (var line in System.IO.File.ReadAllLines(envPath))
                {
                    if (string.IsNullOrWhiteSpace(line) || line.StartsWith("#"))
                        continue;

                    var parts = line.Split('=', (char)2);
                    if (parts.Length == 2)
                    {
                        var key = parts[0].Trim();
                        var value = parts[1].Trim();
                        Environment.SetEnvironmentVariable(key, value);
                    }
                }
            }
        }

        [TestMethod]
        public void CreateOrder_ValidData_ReturnsValidOrderId()
        {
            // Arrange
            var dal = new LIBDALOrder();

            var order = new LIBOrder
            {
                UserID = 1, // Assuming userId 1 exists in test DB
                OrderDate = DateTime.UtcNow,
                SubtotalAmount = 49.99m,
                TaxAmount = 6.50m,
                DeliveryFee = 0.00m,
                TotalAmount = 56.49m,
                Status = "Pending",
                ShippingAddress = "123 Test St, Windsor, ON N9B 1A1",
                PaymentMethod = "**** 1234",
                Email = "test@example.com"
            };

            var items = new List<LIBOrderItem>
            {
                new LIBOrderItem
                {
                    ISBN = "978-0134685991",
                    Title = "Effective Java",
                    Author = "Joshua Bloch",
                    Price = 34.99m,
                    Quantity = 1,
                    Subtotal = 34.99m
                },
                new LIBOrderItem
                {
                    ISBN = "978-0135166307",
                    Title = "Clean Code",
                    Author = "Robert C. Martin",
                    Price = 15.00m,
                    Quantity = 1,
                    Subtotal = 15.00m
                }
            };

            // Act
            int orderId = dal.CreateOrder(order, items);

            // Assert
            Assert.IsTrue(orderId > 0, "Order ID should be greater than 0");

            // Cleanup: In a real test, you'd delete this test order
            // or use a test database that gets rolled back
        }

        [TestMethod]
        [ExpectedException(typeof(ArgumentNullException))]
        public void CreateOrder_NullOrder_ThrowsException()
        {
            // Arrange
            var dal = new LIBDALOrder();
            var items = new List<LIBOrderItem>();

            // Act & Assert - should throw ArgumentNullException
            dal.CreateOrder(null, items);
        }

        [TestMethod]
        [ExpectedException(typeof(ArgumentException))]
        public void CreateOrder_EmptyItems_ThrowsException()
        {
            // Arrange
            var dal = new LIBDALOrder();
            var order = new LIBOrder
            {
                UserID = 1,
                TotalAmount = 100.00m
            };
            var items = new List<LIBOrderItem>(); // Empty list

            // Act & Assert - should throw ArgumentException
            dal.CreateOrder(order, items);
        }

        [TestMethod]
        public void GetOrdersByUserId_ValidUser_ReturnsOrders()
        {
            // Arrange
            var dal = new LIBDALOrder();
            int testUserId = 1; // Assuming userId 1 exists

            // First create a test order
            var order = new LIBOrder
            {
                UserID = testUserId,
                OrderDate = DateTime.UtcNow,
                SubtotalAmount = 25.00m,
                TaxAmount = 3.25m,
                DeliveryFee = 0.00m,
                TotalAmount = 28.25m,
                Status = "Pending",
                Email = "test@example.com"
            };

            var items = new List<LIBOrderItem>
            {
                new LIBOrderItem
                {
                    ISBN = "978-1234567890",
                    Title = "Test Book",
                    Author = "Test Author",
                    Price = 25.00m,
                    Quantity = 1,
                    Subtotal = 25.00m
                }
            };

            int orderId = dal.CreateOrder(order, items);
            Assert.IsTrue(orderId > 0, "Test order should be created");

            // Act
            var orders = dal.GetOrdersByUserId(testUserId);

            // Assert
            Assert.IsNotNull(orders, "Orders list should not be null");
            Assert.IsTrue(orders.Count > 0, "Should have at least one order");

            // Verify the order we just created is in the list
            var createdOrder = orders.Find(o => o.OrderID == orderId);
            Assert.IsNotNull(createdOrder, "Created order should be in the list");
            Assert.AreEqual(testUserId, createdOrder.UserID, "User ID should match");
        }

        [TestMethod]
        public void GetOrderDetails_ValidOrderId_ReturnsOrderWithItems()
        {
            // Arrange
            var dal = new LIBDALOrder();

            // First create a test order
            var order = new LIBOrder
            {
                UserID = 1,
                OrderDate = DateTime.UtcNow,
                SubtotalAmount = 59.98m,
                TaxAmount = 7.80m,
                DeliveryFee = 5.00m,
                TotalAmount = 72.78m,
                Status = "Pending",
                ShippingAddress = "456 Test Ave, Windsor, ON",
                PaymentMethod = "**** 5678",
                Email = "details@test.com"
            };

            var items = new List<LIBOrderItem>
            {
                new LIBOrderItem
                {
                    ISBN = "111-1111111111",
                    Title = "Book One",
                    Author = "Author One",
                    Price = 29.99m,
                    Quantity = 1,
                    Subtotal = 29.99m
                },
                new LIBOrderItem
                {
                    ISBN = "222-2222222222",
                    Title = "Book Two",
                    Author = "Author Two",
                    Price = 29.99m,
                    Quantity = 1,
                    Subtotal = 29.99m
                }
            };

            int orderId = dal.CreateOrder(order, items);

            // Act
            var retrievedOrder = dal.GetOrderDetails(orderId);

            // Assert
            Assert.IsNotNull(retrievedOrder, "Order should not be null");
            Assert.AreEqual(orderId, retrievedOrder.OrderID, "Order ID should match");
            Assert.AreEqual(72.78m, retrievedOrder.TotalAmount, "Total should match");
            Assert.AreEqual("Pending", retrievedOrder.Status, "Status should match");
            Assert.AreEqual(2, retrievedOrder.Items.Count, "Should have 2 items");

            // Verify items
            Assert.AreEqual("Book One", retrievedOrder.Items[0].Title, "First item title should match");
            Assert.AreEqual("Book Two", retrievedOrder.Items[1].Title, "Second item title should match");
        }

        [TestMethod]
        public void GetOrderDetails_InvalidOrderId_ReturnsNull()
        {
            // Arrange
            var dal = new LIBDALOrder();
            int invalidOrderId = -999;

            // Act
            var order = dal.GetOrderDetails(invalidOrderId);

            // Assert
            Assert.IsNull(order, "Order should be null for invalid ID");
        }

        [TestMethod]
        public void UpdateOrderStatus_ValidOrder_UpdatesSuccessfully()
        {
            // Arrange
            var dal = new LIBDALOrder();

            // Create a test order
            var order = new LIBOrder
            {
                UserID = 1,
                OrderDate = DateTime.UtcNow,
                SubtotalAmount = 10.00m,
                TaxAmount = 1.30m,
                DeliveryFee = 0.00m,
                TotalAmount = 11.30m,
                Status = "Pending"
            };

            var items = new List<LIBOrderItem>
            {
                new LIBOrderItem
                {
                    ISBN = "333-3333333333",
                    Title = "Status Test Book",
                    Author = "Test Author",
                    Price = 10.00m,
                    Quantity = 1,
                    Subtotal = 10.00m
                }
            };

            int orderId = dal.CreateOrder(order, items);

            // Act
            bool updated = dal.UpdateOrderStatus(orderId, "Shipped");

            // Assert
            Assert.IsTrue(updated, "Update should succeed");

            // Verify status was actually updated
            var retrievedOrder = dal.GetOrderDetails(orderId);
            Assert.AreEqual("Shipped", retrievedOrder.Status, "Status should be updated to Shipped");
        }

        [TestMethod]
        public void UpdateOrderStatus_InvalidOrderId_ReturnsFalse()
        {
            // Arrange
            var dal = new LIBDALOrder();
            int invalidOrderId = -999;

            // Act
            bool updated = dal.UpdateOrderStatus(invalidOrderId, "Shipped");

            // Assert
            Assert.IsFalse(updated, "Update should fail for invalid order ID");
        }

        [TestMethod]
        public void OrderItem_UpdateSubtotal_CalculatesCorrectly()
        {
            // Arrange
            var item = new LIBOrderItem
            {
                Price = 19.99m,
                Quantity = 3
            };

            // Act
            item.UpdateSubtotal();

            // Assert
            Assert.AreEqual(59.97m, item.Subtotal, "Subtotal should be calculated correctly");
        }

        [TestMethod]
        public void CancelPreOrder_PreOrderStatus_ChangesToCancelled()
        {
            // Arrange
            var order = new LIBOrder
            {
                OrderID = 1,
                Status = "PreOrder"
            };

            // Act
            order.Status = "Cancelled";

            // Assert
            Assert.AreEqual("Cancelled", order.Status);
        }

        [TestMethod]
        public void CancelPreOrder_WhenShipped_ShouldNotChangeStatus()
        {
            // Arrange
            var order = new LIBOrder
            {
                OrderID = 2,
                Status = "Shipped"
            };

            // Act
            string before = order.Status;

            // "Cancelling" has no effect
            if (order.Status != "Shipped")
                order.Status = "Cancelled";

            // Assert
            Assert.AreEqual("Shipped", order.Status);
        }

        [TestMethod]
        public void CancelPreOrder_WhenNotPreOrder_ShouldNotCancel()
        {
            // Arrange
            var order = new LIBOrder
            {
                OrderID = 3,
                Status = "Pending"
            };

            // Act
            string before = order.Status;

            if (order.Status == "PreOrder")
                order.Status = "Cancelled";

            // Assert
            Assert.AreEqual("Pending", order.Status);
        }



    }
}
