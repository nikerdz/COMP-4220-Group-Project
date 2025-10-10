using System;
using System.Collections.Generic;
using System.Diagnostics.Eventing.Reader;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BookStoreLIB
{
    public class Cart // all cart related actions
    {
        public List<Book> shoppingCart = new List<Book>(); // list of books for each customer cart
        public bool addBook(Book book) // based on obj from DB booklist
        {
            if (book == null) return false;
            shoppingCart.Add(book); // adds to shopping cart list
            return true;
        }
        public bool removeBook(Book book) // removing cart books
        {
            if (shoppingCart.Contains(book))
            {
                shoppingCart.Remove(book);
                return true;
            }

            return false;

        }
        public void clearCart() // clearing cart
        {
                shoppingCart.Clear();
           
        }
    }
}
