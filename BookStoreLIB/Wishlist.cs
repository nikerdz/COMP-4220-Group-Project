using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BookStoreLIB
{
    public class Wishlist
    {
        public List<Book> wishlistBooks = new List<Book>();

        public bool AddToWishlist(Book book)
        {
            throw new NotImplementedException(); // <- ensures test will fail if executed
        }

        public bool RemoveFromWishlist(string isbn)
        {
            throw new NotImplementedException();
        }

        public void ClearWishlist()
        {
            throw new NotImplementedException();
        }
    }
}
