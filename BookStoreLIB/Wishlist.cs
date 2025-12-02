using System;
using System.Collections.Generic;

namespace BookStoreLIB
{
    public class Wishlist
    {
        public List<Book> wishlistBooks = new List<Book>();

        // Add a book if it's not already in the wishlist (by ISBN)
        public bool AddToWishlist(Book book)
        {
            // Guard clauses
            if (book == null || string.IsNullOrWhiteSpace(book.ISBN))
                return false;

            // Check for duplicates by ISBN
            foreach (var b in wishlistBooks)
            {
                if (string.Equals(b.ISBN, book.ISBN, StringComparison.Ordinal))
                {
                    // Duplicate found – do not add
                    return false;
                }
            }

            wishlistBooks.Add(book);
            return true;
        }

        // Remove a book by ISBN
        public bool RemoveFromWishlist(string isbn)
        {
            if (string.IsNullOrWhiteSpace(isbn))
                return false;

            for (int i = 0; i < wishlistBooks.Count; i++)
            {
                if (string.Equals(wishlistBooks[i].ISBN, isbn, StringComparison.Ordinal))
                {
                    wishlistBooks.RemoveAt(i);
                    return true;
                }
            }

            return false; // not found
        }

        // Clear all books from the wishlist
        public void ClearWishlist()
        {
            wishlistBooks.Clear();
        }
    }
}
