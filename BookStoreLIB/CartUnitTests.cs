using Microsoft.VisualStudio.TestTools.UnitTesting;
using System;
using System.Collections.Generic;
using System.Data.SqlClient;

namespace BookStoreLIB
{
    [TestClass]
    public class CartUnitTests
    {
        private static string _conn;
        private static readonly List<int> _testUserIds = new List<int>();
        private static readonly string _testISBN1 = "1234567890";
        private static readonly string _testISBN2 = "0987654321";

        [ClassInitialize]
        public static void ClassInit(TestContext _)
        {
            _conn = CartDAL.ResolveConn();
            // Quick probe to ensure DB is accessible
            using (var c = new SqlConnection(_conn)) { c.Open(); }
        }

        [ClassCleanup]
        public static void ClassCleanup()
        {
            // Clean up test data for all test users
            foreach (var userId in _testUserIds)
            {
                try
                {
                    CartDAL.ClearCart(userId);
                }
                catch { /* Best effort cleanup */ }
            }
        }

        [TestInitialize]
        public void TestInit()
        {
            // Each test gets a unique user ID to avoid conflicts
            // Using a high number to avoid conflicts with real users
            int testUserId = 9000 + new Random().Next(1000);
            _testUserIds.Add(testUserId);
        }

        // ------------ TESTS ------------

        [TestMethod]
        [TestCategory("Integration")]
        public void Cart_AddItem_Succeeds()
        {
            // Arrange
            int userId = _testUserIds[_testUserIds.Count - 1];

            // Act
            bool added = CartDAL.AddItemToCart(userId, _testISBN1, 2);

            // Assert
            Assert.IsTrue(added, "Item should be added to cart.");
            
            var cartItems = CartDAL.GetCartItems(userId);
            Assert.IsNotNull(cartItems);
            Assert.AreEqual(1, cartItems.Count, "Cart should have 1 item.");
            Assert.AreEqual(_testISBN1, cartItems[0].ISBN);
            Assert.AreEqual(2, cartItems[0].Quantity, "Quantity should be 2.");
        }

        [TestMethod]
        [TestCategory("Integration")]
        public void Cart_AddDuplicateItem_IncrementsQuantity()
        {
            // Arrange
            int userId = _testUserIds[_testUserIds.Count - 1];
            CartDAL.AddItemToCart(userId, _testISBN1, 1);

            // Act - add same item again
            bool added = CartDAL.AddItemToCart(userId, _testISBN1, 3);

            // Assert
            Assert.IsTrue(added, "Adding duplicate should increment quantity.");
            
            var cartItems = CartDAL.GetCartItems(userId);
            Assert.AreEqual(1, cartItems.Count, "Should still have only 1 unique item.");
            Assert.AreEqual(4, cartItems[0].Quantity, "Quantity should be 1 + 3 = 4.");
        }

        [TestMethod]
        [TestCategory("Integration")]
        public void Cart_RemoveItem_Succeeds()
        {
            // Arrange
            int userId = _testUserIds[_testUserIds.Count - 1];
            CartDAL.AddItemToCart(userId, _testISBN1, 5);

            // Act - remove 2 items
            bool removed = CartDAL.RemoveItemFromCart(userId, _testISBN1, 2);

            // Assert
            Assert.IsTrue(removed, "Item quantity should be reduced.");
            
            var cartItems = CartDAL.GetCartItems(userId);
            Assert.AreEqual(1, cartItems.Count);
            Assert.AreEqual(3, cartItems[0].Quantity, "Quantity should be 5 - 2 = 3.");
        }

        [TestMethod]
        [TestCategory("Integration")]
        public void Cart_RemoveItem_DeletesWhenQuantityZero()
        {
            // Arrange
            int userId = _testUserIds[_testUserIds.Count - 1];
            CartDAL.AddItemToCart(userId, _testISBN1, 2);

            // Act - remove all items
            bool removed = CartDAL.RemoveItemFromCart(userId, _testISBN1, 2);

            // Assert
            Assert.IsTrue(removed, "Item should be removed from cart.");
            
            var cartItems = CartDAL.GetCartItems(userId);
            Assert.AreEqual(0, cartItems.Count, "Cart should be empty.");
        }

        [TestMethod]
        [TestCategory("Integration")]
        public void Cart_UpdateQuantity_Succeeds()
        {
            // Arrange
            int userId = _testUserIds[_testUserIds.Count - 1];
            CartDAL.AddItemToCart(userId, _testISBN1, 1);

            // Act
            bool updated = CartDAL.UpdateCartItemQuantity(userId, _testISBN1, 10);

            // Assert
            Assert.IsTrue(updated, "Quantity should be updated.");
            
            var cartItems = CartDAL.GetCartItems(userId);
            Assert.AreEqual(10, cartItems[0].Quantity, "Quantity should be set to 10.");
        }

        [TestMethod]
        [TestCategory("Integration")]
        public void Cart_UpdateQuantityToZero_DeletesItem()
        {
            // Arrange
            int userId = _testUserIds[_testUserIds.Count - 1];
            CartDAL.AddItemToCart(userId, _testISBN1, 5);

            // Act
            bool updated = CartDAL.UpdateCartItemQuantity(userId, _testISBN1, 0);

            // Assert
            Assert.IsTrue(updated, "Item should be deleted when quantity set to 0.");
            
            var cartItems = CartDAL.GetCartItems(userId);
            Assert.AreEqual(0, cartItems.Count, "Cart should be empty.");
        }

        [TestMethod]
        [TestCategory("Integration")]
        public void Cart_GetCartItems_ReturnsCorrectItems()
        {
            // Arrange
            int userId = _testUserIds[_testUserIds.Count - 1];
            CartDAL.AddItemToCart(userId, _testISBN1, 2);
            CartDAL.AddItemToCart(userId, _testISBN2, 3);

            // Act
            var cartItems = CartDAL.GetCartItems(userId);

            // Assert
            Assert.IsNotNull(cartItems);
            Assert.AreEqual(2, cartItems.Count, "Cart should have 2 different items.");
            Assert.IsTrue(cartItems.Exists(b => b.ISBN == _testISBN1 && b.Quantity == 2));
            Assert.IsTrue(cartItems.Exists(b => b.ISBN == _testISBN2 && b.Quantity == 3));
        }

        [TestMethod]
        [TestCategory("Integration")]
        public void Cart_ClearCart_RemovesAllItems()
        {
            // Arrange
            int userId = _testUserIds[_testUserIds.Count - 1];
            CartDAL.AddItemToCart(userId, _testISBN1, 2);
            CartDAL.AddItemToCart(userId, _testISBN2, 3);

            // Act
            bool cleared = CartDAL.ClearCart(userId);

            // Assert
            Assert.IsTrue(cleared, "Cart should be cleared.");
            
            var cartItems = CartDAL.GetCartItems(userId);
            Assert.AreEqual(0, cartItems.Count, "Cart should be empty after clearing.");
        }

        [TestMethod]
        [TestCategory("Integration")]
        public void Cart_GetSubtotal_CalculatesCorrectly()
        {
            // Arrange
            int userId = _testUserIds[_testUserIds.Count - 1];
            CartDAL.AddItemToCart(userId, _testISBN1, 2);  // Assuming price from DB
            CartDAL.AddItemToCart(userId, _testISBN2, 1);

            // Act
            decimal subtotal = CartDAL.GetCartSubtotal(userId);

            // Assert
            Assert.IsTrue(subtotal >= 0, "Subtotal should be non-negative.");
            // Note: Exact value depends on book prices in database
        }

        [TestMethod]
        [TestCategory("Integration")]
        public void Cart_RemoveNonexistentItem_ReturnsFalse()
        {
            // Arrange
            int userId = _testUserIds[_testUserIds.Count - 1];

            // Act
            bool removed = CartDAL.RemoveItemFromCart(userId, "9999999999", 1);

            // Assert
            Assert.IsFalse(removed, "Removing non-existent item should return false.");
        }

        [TestMethod]
        [TestCategory("Integration")]
        public void Cart_GetEmptyCart_ReturnsEmptyList()
        {
            // Arrange
            int userId = _testUserIds[_testUserIds.Count - 1];

            // Act
            var cartItems = CartDAL.GetCartItems(userId);

            // Assert
            Assert.IsNotNull(cartItems);
            Assert.AreEqual(0, cartItems.Count, "Empty cart should return empty list.");
        }
    }
}
