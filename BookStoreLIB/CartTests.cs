using Microsoft.VisualStudio.TestTools.UnitTesting;
using BookStoreLIB;

namespace BookStoreLIB.Tests
{
    [TestClass]
    public class CartTests
    {
        [TestMethod]
        public void AddBook_ShouldIncreaseCartCount()
        {
            var cart = new Cart();
            var book = new Book { BookID = 1, Title = "Book A", Author = "Tester", Price = 10 };
            cart.addBook(book);

            Assert.AreEqual(1, cart.shoppingCart.Count);
        }

        [TestMethod]
        public void AddMultipleBooks_ShouldIncreaseCountAccordingly()
        {
            var cart = new Cart();
            cart.addBook(new Book { BookID = 1, Title = "A", Price = 10 });
            cart.addBook(new Book { BookID = 2, Title = "B", Price = 20 });
            cart.addBook(new Book { BookID = 3, Title = "C", Price = 30 });

            Assert.AreEqual(3, cart.shoppingCart.Count, "Cart should contain all three unique books.");
        }

        [TestMethod]
        public void AddDuplicateBook_ShouldIncreaseQuantityNotCount()
        {
            var cart = new Cart();
            var book = new Book { BookID = 1, Title = "Same", Price = 10, Quantity = 1 };
            cart.addBook(book);
            cart.addBook(book);

            Assert.AreEqual(1, cart.shoppingCart.Count, "Duplicate book should not create a new entry.");
            Assert.AreEqual(2, cart.shoppingCart[0].Quantity, "Quantity should increase for duplicate book.");
        }

        [TestMethod]
        public void RemoveBook_ShouldDecreaseCartCount()
        {
            var cart = new Cart();
            var book = new Book { BookID = 1, Title = "Book X", Price = 10 };
            cart.addBook(book);
            cart.removeBook(book);

            Assert.AreEqual(0, cart.shoppingCart.Count);
        }

        [TestMethod]
        public void RemoveBook_NotInCart_ShouldReturnFalse_AndKeepCount()
        {
            var cart = new Cart();
            var book = new Book { BookID = 1, Title = "Book A" };
            cart.addBook(book);
            var other = new Book { BookID = 2, Title = "Book B" };

            var result = cart.removeBook(other);

            Assert.IsFalse(result);
            Assert.AreEqual(1, cart.shoppingCart.Count);
        }

        [TestMethod]
        public void ClearCart_ShouldEmptyAllItems()
        {
            var cart = new Cart();
            cart.addBook(new Book { BookID = 1, Title = "A", Price = 10 });
            cart.addBook(new Book { BookID = 2, Title = "B", Price = 20 });

            cart.clearCart();

            Assert.AreEqual(0, cart.shoppingCart.Count);
        }

        [TestMethod]
        public void ClearCart_WhenAlreadyEmpty_ShouldNotThrowError()
        {
            var cart = new Cart();
            cart.clearCart();
            Assert.AreEqual(0, cart.shoppingCart.Count);
        }

        [TestMethod]
        public void AddAndRemoveMultiple_ShouldBehaveCorrectly()
        {
            var cart = new Cart();
            var b1 = new Book { BookID = 1, Title = "A", Price = 10 };
            var b2 = new Book { BookID = 2, Title = "B", Price = 15 };
            var b3 = new Book { BookID = 3, Title = "C", Price = 5 };

            cart.addBook(b1);
            cart.addBook(b2);
            cart.addBook(b3);
            cart.removeBook(b2);

            Assert.AreEqual(2, cart.shoppingCart.Count, "Cart should have 2 items after removing one.");
        }
    }
}
