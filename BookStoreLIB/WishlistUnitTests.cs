using Microsoft.VisualStudio.TestTools.UnitTesting;
using System;
using System.Collections.Generic;
using System.Data.SqlClient;

namespace BookStoreLIB
{
    [TestClass]
    public class WishlistUnitTests
    {
        private static string _conn; // connection string for optional DB-backed wishlist
        private static readonly List<string> _testUsers = new List<string>();

        [ClassInitialize]
        public static void ClassInit(TestContext _)
        {
            _conn = WishlistDAL.ResolveConn();
            // Quick probe to ensure DB is accessible
            using (var c = new SqlConnection(_conn)) { c.Open(); }
        }

        [ClassCleanup]
        public static void ClassCleanup()
        {
            foreach (var user in _testUsers)
                WishlistDAL.SafeDeleteWishlist(user);
        }

        // ------------ TESTS ------------

        [TestMethod]
        [TestCategory("Integration")]
        public void Wishlist_AddBook_Succeeds()
        {
            // Arrange: create a throwaway user & book
            string username = "ut_user_" + Guid.NewGuid().ToString("N").Substring(0, 8);
            _testUsers.Add(username);

            var wishlist = new Wishlist();
            var book = new Book
            {
                ISBN = "1234567890",
                Title = "Unit Test Book",
                Price = 9.99m
            };

            // Act
            bool added = wishlist.AddToWishlist(book);

            // Assert
            Assert.IsTrue(added, "Book should be added to wishlist.");
            Assert.AreEqual(1, wishlist.wishlistBooks.Count);
            Assert.AreEqual("1234567890", wishlist.wishlistBooks[0].ISBN);
        }

        [TestMethod]
        [TestCategory("Integration")]
        public void Wishlist_AddDuplicateBook_Fails()
        {
            var wishlist = new Wishlist();
            var book = new Book { ISBN = "1111111111", Title = "Book A" };

            wishlist.AddToWishlist(book);
            bool duplicateAdded = wishlist.AddToWishlist(book);

            Assert.IsFalse(duplicateAdded, "Adding duplicate book should fail.");
            Assert.AreEqual(1, wishlist.wishlistBooks.Count);
        }

        [TestMethod]
        [TestCategory("Integration")]
        public void Wishlist_RemoveBook_Succeeds()
        {
            var wishlist = new Wishlist();
            var book = new Book { ISBN = "2222222222", Title = "Book B" };

            wishlist.AddToWishlist(book);
            bool removed = wishlist.RemoveFromWishlist(book.ISBN);

            Assert.IsTrue(removed, "Book should be removed successfully.");
            Assert.AreEqual(0, wishlist.wishlistBooks.Count);
        }

        [TestMethod]
        [TestCategory("Integration")]
        public void Wishlist_RemoveNonexistentBook_Fails()
        {
            var wishlist = new Wishlist();
            bool removed = wishlist.RemoveFromWishlist("NOT_EXIST");
            Assert.IsFalse(removed, "Removing a book that doesn't exist should fail.");
        }

        [TestMethod]
        [TestCategory("Integration")]
        public void Wishlist_ClearWishlist_RemovesAllBooks()
        {
            var wishlist = new Wishlist();
            wishlist.AddToWishlist(new Book { ISBN = "333" });
            wishlist.AddToWishlist(new Book { ISBN = "444" });

            wishlist.ClearWishlist();

            Assert.AreEqual(0, wishlist.wishlistBooks.Count);
        }

        // ------------ Optional DB-backed tests ------------

        [TestMethod]
        [TestCategory("Integration")]
        public void WishlistDAL_SaveAndLoad_Works()
        {
            string username = "ut_user_" + Guid.NewGuid().ToString("N").Substring(0, 8);
            _testUsers.Add(username);

            var wishlist = new Wishlist();
            wishlist.AddToWishlist(new Book { ISBN = "555", Title = "DB Book" });

            // Act: save wishlist to DB
            WishlistDAL.SaveWishlist(username, wishlist);

            // Act: load wishlist from DB
            var loaded = WishlistDAL.LoadWishlist(username);

            // Assert
            Assert.IsNotNull(loaded, "Loaded wishlist should not be null.");
            Assert.AreEqual(1, loaded.wishlistBooks.Count);
            Assert.AreEqual("555", loaded.wishlistBooks[0].ISBN);
        }
    }
}
