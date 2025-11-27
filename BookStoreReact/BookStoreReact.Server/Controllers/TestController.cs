using System;
using System.Collections.Concurrent;
using System.Collections.Generic;
using System.Data.SqlClient;
using Microsoft.AspNetCore.Mvc;
using BookStoreLIB;
using BookStoreReact.Server.Models;
using BookStoreReact.Server.Data;

namespace BookStoreReact.Server.Controllers
{
    [ApiController]
    [Route("api/test")]
    public class TestController : ControllerBase
    {
        // DB CONN STRING 
        private static string BuildConnString()
        {
            var user = Environment.GetEnvironmentVariable("AGILE_DB_USER");
            var pass = Environment.GetEnvironmentVariable("AGILE_DB_PASSWORD");

            if (string.IsNullOrWhiteSpace(user) || string.IsNullOrWhiteSpace(pass))
                throw new InvalidOperationException("Missing AGILE_DB_USER/AGILE_DB_PASSWORD.");

            var csb = new SqlConnectionStringBuilder
            {
                DataSource = "tfs.cs.uwindsor.ca",
                InitialCatalog = "Agile1422DB25",
                PersistSecurityInfo = true,
                UserID = user,
                Password = pass,
                Encrypt = true,
                TrustServerCertificate = true
            };

            return csb.ConnectionString;
        }

        // PING
        [HttpGet]
        public IActionResult Get()
        {
            return Ok(new
            {
                status = "test-ok",
                time = DateTime.UtcNow
            });
        }

        // LOGIN
        public class LoginRequest
        {
            public string Username { get; set; } = "";
            public string Password { get; set; } = "";
        }

        [HttpPost("login")]
        public IActionResult Login([FromBody] LoginRequest req)
        {
            var user = new UserData();

            try
            {
                bool ok = user.LogIn(req.Username, req.Password);

                if (!ok)
                    return Unauthorized(new { message = "Invalid username or password." });

                return Ok(new
                {
                    userId = user.UserID,
                    username = user.LoginName,
                    isManager = user.IsManager,
                    type = user.Type
                });
            }
            catch (ArgumentException ex)
            {
                return BadRequest(new { message = ex.Message });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Server error.", detail = ex.Message });
            }
        }

        // REGISTER
        public class RegisterRequest
        {
            public string FullName { get; set; } = "";
            public string Username { get; set; } = "";
            public string Password { get; set; } = "";
            public string Email { get; set; } = "";
        }

        [HttpPost("register")]
        public IActionResult Register([FromBody] RegisterRequest req)
        {
            try
            {
                // Validate required fields
                if (string.IsNullOrWhiteSpace(req.Username))
                    return BadRequest(new { message = "Username is required." });

                if (string.IsNullOrWhiteSpace(req.Password))
                    return BadRequest(new { message = "Password is required." });

                if (string.IsNullOrWhiteSpace(req.Email))
                    return BadRequest(new { message = "Email is required." });

                // Attempt to register user
                var dal = new DALUserInfo();
                bool registered = dal.RegisterUser(req.FullName, req.Username, req.Password, req.Email);

                if (!registered)
                    return BadRequest(new { message = "Username already exists. Please choose a different username." });

                // Auto-login after successful registration
                var user = new UserData();
                bool loggedIn = user.LogIn(req.Username, req.Password);

                if (!loggedIn)
                    return StatusCode(500, new { message = "Registration succeeded but auto-login failed." });

                return Ok(new
                {
                    userId = user.UserID,
                    username = user.LoginName,
                    isManager = user.IsManager,
                    type = user.Type
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Server error.", detail = ex.Message });
            }
        }

        // BOOKS 
        [HttpGet("books")]
        public ActionResult<IEnumerable<Book>> GetBooks()
        {
            var books = new List<Book>();

            using (var conn = new SqlConnection(BuildConnString()))
            {
                conn.Open();
                const string sql = "SELECT ISBN, CategoryID, Title, Author, Price, Year, InStock FROM BookData";

                using (var cmd = new SqlCommand(sql, conn))
                using (var reader = cmd.ExecuteReader())
                {
                    while (reader.Read())
                    {
                        var book = new Book
                        {
                            ISBN = reader.GetString(0),
                            CategoryID = reader.GetInt32(1),
                            Title = reader.GetString(2),
                            Author = reader.GetString(3),
                            Price = reader.GetDecimal(4),
                            Year = reader.GetString(5),
                            InStock = reader.GetInt32(6)
                        };

                        books.Add(book);
                    }
                }
            }

            return Ok(books);
        }

        // CART
        private static readonly ConcurrentDictionary<int, Cart> Carts
            = new ConcurrentDictionary<int, Cart>();

        private Cart GetCart(int userId)
        {
            return Carts.GetOrAdd(userId, _ => new Cart());
        }

        [HttpGet("cart/{userId:int}")]
        public ActionResult<IEnumerable<Book>> GetCartItems(int userId)
        {
            var cart = GetCart(userId);
            return Ok(cart.cartBooks);
        }

        public class AddItemRequest
        {
            public int UserId { get; set; }
            public string ISBN { get; set; } = "";
            public int CategoryID { get; set; }
            public string Title { get; set; } = "";
            public string Author { get; set; } = "";
            public decimal Price { get; set; }
            public int SupplierId { get; set; }
            public string Year { get; set; } = "";
            public string Edition { get; set; } = "";
            public string Publisher { get; set; } = "";
        }

        // ITEMS 
        [HttpPost("cart/items")]
        public IActionResult AddCartItem([FromBody] AddItemRequest req)
        {
            var cart = GetCart(req.UserId);

            var book = new Book
            {
                ISBN = req.ISBN,
                CategoryID = req.CategoryID,
                Title = req.Title,
                Author = req.Author,
                Price = req.Price,
                SupplierId = req.SupplierId,
                Year = req.Year,
                Edition = req.Edition,
                Publisher = req.Publisher
            };

            cart.addBook(book);
            return Ok(cart.cartBooks);
        }

        public class RemoveItemRequest
        {
            public int UserId { get; set; }
            public string ISBN { get; set; } = "";
        }

        [HttpDelete("cart/items")]
        public IActionResult RemoveCartItem([FromBody] RemoveItemRequest req)
        {
            var cart = GetCart(req.UserId);
            var dummy = new Book { ISBN = req.ISBN };

            bool ok = cart.removeBook(dummy);
            if (!ok)
                return NotFound(new { message = "Book not found in cart." });

            return Ok(cart.cartBooks);
        }

        [HttpDelete("cart/{userId:int}")]
        public IActionResult ClearCart(int userId)
        {
            var cart = GetCart(userId);
            cart.clearCart();
            return Ok();
        }

        // CHECKOUT
        public class CheckoutRequest
        {
            public int UserId { get; set; }
            public string Email { get; set; } = "";
            public string CardNumber { get; set; } = "";
            public string CVV { get; set; } = "";
            public string Expiry { get; set; } = ""; // MM/YY
            public string NameOnCard { get; set; } = "";
            public string Address { get; set; } = "";
            public decimal DeliveryFee { get; set; } = 0m;
            public decimal TaxRate { get; set; } = 0.13m;
        }

        [HttpPost("cart/checkout")]
        public IActionResult Checkout([FromBody] CheckoutRequest req)
        {
            var cart = GetCart(req.UserId);
            var items = cart.cartBooks;

            // Check if cart is empty
            if (items == null || items.Count == 0)
                return BadRequest(new { message = "Cart is empty." });

            var required = new Dictionary<string, string>
            {
                { "Email",      req.Email },
                { "CardNumber", req.CardNumber },
                { "CVV",        req.CVV },
                { "Expiry",     req.Expiry },
                { "NameOnCard", req.NameOnCard },
                { "Address",    req.Address }
            };

            var missing = PaymentRules.GetMissingFields(required);
            if (missing.Count > 0)
                return BadRequest(new { message = "Missing required fields.", missing });

            if (!PaymentRules.IsValidEmail(req.Email))
                return BadRequest(new { message = "Invalid email address." });

            if (!PaymentRules.IsValidCardNumber(req.CardNumber))
                return BadRequest(new { message = "Invalid card number." });

            if (!PaymentRules.IsValidCVV(req.CVV))
                return BadRequest(new { message = "Invalid CVV." });

            if (!PaymentRules.IsValidExpiry(req.Expiry, DateTime.UtcNow))
                return BadRequest(new { message = "Card is expired or expiry is invalid." });

            var (subtotal, taxes, total) =
                PaymentRules.ComputeTotals(items, req.TaxRate, req.DeliveryFee);

            // Payment validation passed - now save the order to database
            try
            {
                // Get last 4 digits of card for storage
                string last4 = req.CardNumber.Length >= 4 
                    ? "**** " + req.CardNumber.Substring(req.CardNumber.Length - 4) 
                    : "****";

                // Create order object
                var order = new Order
                {
                    UserID = req.UserId,
                    OrderDate = DateTime.UtcNow,
                    SubtotalAmount = subtotal,
                    TaxAmount = taxes,
                    DeliveryFee = req.DeliveryFee,
                    TotalAmount = total,
                    Status = "Pending",
                    ShippingAddress = req.Address,
                    PaymentMethod = last4,
                    Email = req.Email
                };

                // Convert cart books to order items
                var orderItems = new List<OrderItem>();
                foreach (var book in items)
                {
                    orderItems.Add(new OrderItem
                    {
                        ISBN = book.ISBN,
                        Title = book.Title,
                        Author = book.Author,
                        Price = book.Price,
                        Quantity = book.Quantity,
                        Subtotal = book.Price * book.Quantity
                    });
                }

                // Save order to database
                var dalOrder = new DALOrder();
                int orderId = dalOrder.CreateOrder(order, orderItems);

                // Clear cart after successful order
                cart.clearCart();

                return Ok(new
                {
                    orderId = orderId,
                    subtotal,
                    taxes,
                    delivery = req.DeliveryFee,
                    total,
                    itemCount = items.Count,
                    message = "Order placed successfully!"
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Payment validated but failed to create order.", detail = ex.Message });
            }
        }

        // RECOMMENDATIONS
        [HttpGet("recommendations/{userId:int}")]
        public ActionResult<IEnumerable<Book>> GetRecommendations(int userId, int limit = 4)
        {
            var recs = new List<Book>();

            try
            {
                using var conn = new SqlConnection(BuildConnString());
                conn.Open();

                // Try to find user's top genre from Cart table
                const string topCatSql = @"
                    SELECT TOP 1 bd.CategoryID
                    FROM Cart c
                    JOIN BookData bd ON bd.ISBN = c.ISBN
                    WHERE c.CustomerID = @UserId
                    GROUP BY bd.CategoryID
                    ORDER BY SUM(ISNULL(c.Quantity, 1)) DESC";

                int? topCat = null;
                using (var cmd = new SqlCommand(topCatSql, conn))
                {
                    cmd.Parameters.AddWithValue("@UserId", userId);
                    var obj = cmd.ExecuteScalar();
                    if (obj != null && obj != DBNull.Value)
                        topCat = Convert.ToInt32(obj);
                }

                // fetch recommendations excluding items already in user's cart
                string recSql;
                if (topCat.HasValue)
                {
                    recSql = @"
                        SELECT TOP (@Limit) ISBN, CategoryID, Title, Author, Price, Year, InStock
                        FROM BookData
                        WHERE CategoryID = @Cat
                          AND ISBN NOT IN (SELECT ISBN FROM Cart WHERE CustomerID = @UserId)
                        ORDER BY NEWID()";
                }
                else
                {
                    // random books excluding cart items
                    recSql = @"
                        SELECT TOP (@Limit) ISBN, CategoryID, Title, Author, Price, Year, InStock
                        FROM BookData
                        WHERE ISBN NOT IN (SELECT ISBN FROM Cart WHERE CustomerID = @UserId)
                        ORDER BY NEWID()";
                }

                using (var cmd2 = new SqlCommand(recSql, conn))
                {
                    cmd2.Parameters.AddWithValue("@Limit", limit);
                    cmd2.Parameters.AddWithValue("@UserId", userId);
                    if (topCat.HasValue)
                        cmd2.Parameters.AddWithValue("@Cat", topCat.Value);

                    using var reader = cmd2.ExecuteReader();
                    while (reader.Read())
                    {
                        recs.Add(new Book
                        {
                            ISBN = reader.GetString(0),
                            CategoryID = reader.GetInt32(1),
                            Title = reader.GetString(2),
                            Author = reader.GetString(3),
                            Price = reader.GetDecimal(4),
                            Year = reader.GetString(5),
                            InStock = reader.GetInt32(6)
                        });
                    }
                }
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Error computing recommendations", detail = ex.Message });
            }

            return Ok(recs);
        }

        // WISHLIST
        [HttpGet("wishlist/{userId:int}")]
        public ActionResult<IEnumerable<Book>> GetWishlist(int userId)
        {
            var result = new List<Book>();
            try
            {
                using var conn = new SqlConnection(BuildConnString());
                conn.Open();

                const string sql = @"
                    SELECT bd.ISBN, bd.CategoryID, bd.Title, bd.Author, bd.Price, bd.Year, bd.InStock
                    FROM Wishlist w
                    JOIN BookData bd ON bd.ISBN = w.ISBN
                    WHERE w.CustomerID = @UserId";

                using var cmd = new SqlCommand(sql, conn);
                cmd.Parameters.AddWithValue("@UserId", userId);

                using var reader = cmd.ExecuteReader();
                while (reader.Read())
                {
                    result.Add(new Book
                    {
                        ISBN = reader.GetString(0),
                        CategoryID = reader.GetInt32(1),
                        Title = reader.GetString(2),
                        Author = reader.GetString(3),
                        Price = reader.GetDecimal(4),
                        Year = reader.GetString(5),
                        InStock = reader.GetInt32(6)
                    });
                }
            }
            catch (Exception ex)
            {
                // Log and return empty wishlist instead of 500 so the frontend remains usable while DB is fixed
                Console.Error.WriteLine($"GetWishlist error: {ex}");
                return Ok(new List<Book>());
            }

            return Ok(result);
        }

        public class WishlistItemRequest
        {
            public int UserId { get; set; }
            public string ISBN { get; set; } = "";
        }

        [HttpPost("wishlist/items")]
        public IActionResult AddWishlistItem([FromBody] WishlistItemRequest req)
        {
            try
            {
                using var conn = new SqlConnection(BuildConnString());
                conn.Open();

                // insert if not exists
                const string sql = @"
                    IF NOT EXISTS (SELECT 1 FROM Wishlist WHERE CustomerID = @UserId AND ISBN = @ISBN)
                    INSERT INTO Wishlist (CustomerID, ISBN) VALUES (@UserId, @ISBN)";

                using var cmd = new SqlCommand(sql, conn);
                cmd.Parameters.AddWithValue("@UserId", req.UserId);
                cmd.Parameters.AddWithValue("@ISBN", req.ISBN);
                cmd.ExecuteNonQuery();
                return Ok();
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Error adding to wishlist", detail = ex.Message });
            }
        }

        [HttpDelete("wishlist/items")]
        public IActionResult RemoveWishlistItem([FromBody] WishlistItemRequest req)
        {
            try
            {
                using var conn = new SqlConnection(BuildConnString());
                conn.Open();

                const string sql = "DELETE FROM Wishlist WHERE CustomerID = @UserId AND ISBN = @ISBN";

                using var cmd = new SqlCommand(sql, conn);
                cmd.Parameters.AddWithValue("@UserId", req.UserId);
                cmd.Parameters.AddWithValue("@ISBN", req.ISBN);
                var rows = cmd.ExecuteNonQuery();
                if (rows == 0)
                    return NotFound(new { message = "Item not found in wishlist." });

                return Ok();
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Error removing from wishlist", detail = ex.Message });
            }
        }
    }
}
