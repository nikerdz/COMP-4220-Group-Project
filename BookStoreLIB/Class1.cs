using Microsoft.VisualStudio.TestTools.UnitTesting;
using BookStoreLIB;

namespace BookStoreLIB.Tests
{
    [TestClass]
    public class PreOrderTests
    {
        
        private Book MakeBook(string isbn, int stock)
        {
            return new Book
            {
                ISBN = isbn,
                Title = "Test Book",
                Author = "Tester",
                Price = 10,
                Quantity = 0,
                InStock = stock
            };
        }

        [TestMethod]
        public void AddBook_InStock_ShouldIncreaseCartCount()
        {
            var cart = new Cart();
            var book = MakeBook("111", 5);

            cart.addBook(book);

            Assert.AreEqual(1, cart.cartBooks.Count);
        }

        [TestMethod]
        public void AddBook_OutOfStock_ShouldAllowPreOrder()
        {
            var cart = new Cart();
            var book = MakeBook("222", 0);

            cart.addBook(book);

            Assert.AreEqual(1, cart.cartBooks.Count, "Preorder book should still be added.");
            Assert.AreEqual(1, cart.cartBooks[0].Quantity);
        }

        [TestMethod]
        public void AddMultiplePreOrders_ShouldIncreaseQuantity()
        {
            var cart = new Cart();
            var book = MakeBook("333", 0);

            cart.addBook(book);
            cart.addBook(book);

            Assert.AreEqual(1, cart.cartBooks.Count);
            Assert.AreEqual(2, cart.cartBooks[0].Quantity, "Preorder count should increase.");
        }

        [TestMethod]
        public void RemovePreOrder_ShouldDecreaseQuantity()
        {
            var cart = new Cart();
            var book = MakeBook("444", 0);

            cart.addBook(book);
            cart.addBook(book);
            cart.removeBook(book);

            Assert.AreEqual(1, cart.cartBooks[0].Quantity);
        }

        [TestMethod]
        public void RemoveLastPreOrder_ShouldRemoveFromCart()
        {
            var cart = new Cart();
            var book = MakeBook("555", 0);

            cart.addBook(book);
            cart.removeBook(book);

            Assert.AreEqual(0, cart.cartBooks.Count);
        }
    }
}
