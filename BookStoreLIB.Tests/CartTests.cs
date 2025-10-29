using Microsoft.VisualStudio.TestTools.UnitTesting;
using BookStoreLIB;
using System.Collections.Generic;

namespace BookStoreLIB.Tests
{
    [TestClass]
    public class CartTests
    {
        [TestMethod]
        public void AddBook_ShouldIncreaseCartCount()
        {

            var cart = new Cart();
            var book = new Book { BookID = 1, Title = "Test Book", Author = "Tester", Price = 10 };

            cart.addBook(book);

            Assert.AreEqual(1, cart.shoppingCart.Count);
        }

        [TestMethod]
        public void RemoveBook_ShouldDecreaseCartCount()
        {
            
            var cart = new Cart();
            var book = new Book { BookID = 1, Title = "Test Book", Author = "Tester", Price = 10 };
            cart.addBook(book);

            
            cart.removeBook(book);

            
            Assert.AreEqual(0, cart.shoppingCart.Count);
        }

        [TestMethod]
        public void ClearCart_ShouldEmptyTheCart()
        {
            var cart = new Cart();
            cart.addBook(new Book { BookID = 1, Title = "Book A" });
            cart.addBook(new Book { BookID = 2, Title = "Book B" });

        
            cart.clearCart();

            Assert.AreEqual(0, cart.shoppingCart.Count);
        }
    }
}
