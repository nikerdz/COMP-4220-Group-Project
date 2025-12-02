using Microsoft.AspNetCore.Mvc;
using BookStoreReact.Server.Data;
using BookStoreReact.Server.Models;
using BookStoreLIB;

namespace BookStoreReact.Server.Controllers
{
    [ApiController]
    [Route("api/orders")]
    public class OrderController : ControllerBase
    {
        // --- CUSTOMER CREATES ORDER ---
        [HttpPost("create")]
        public IActionResult CreateOrder([FromBody] OrderCreateRequest req)
        {
            try
            {
                if (req.Items == null || req.Items.Count == 0)
                    return BadRequest(new { message = "Order must have at least one item." });

                decimal subtotal = 0;
                var orderItems = new List<OrderItem>();

                foreach (var item in req.Items)
                {
                    if (item.Quantity <= 0)
                        return BadRequest(new { message = $"Invalid quantity for item: {item.Title}" });

                    var entry = new OrderItem
                    {
                        ISBN = item.ISBN,
                        Title = item.Title,
                        Author = item.Author,
                        Price = item.Price,
                        Quantity = item.Quantity,
                        Subtotal = item.Price * item.Quantity
                    };

                    orderItems.Add(entry);
                    subtotal += entry.Subtotal;
                }

                // Coupon system
                if (!string.IsNullOrWhiteSpace(req.CouponCode))
                {
                    var coupon = CouponDAL.LoadCoupon(req.CouponCode);
                    var couponEngine = new Coupon();

                    if (coupon != null && couponEngine.ValidateCoupon(coupon))
                    {
                        subtotal = couponEngine.ApplyDiscount(subtotal, coupon);
                        CouponDAL.IncrementUsage(coupon.CouponID);
                    }
                    else
                    {
                        return BadRequest(new { message = "Invalid or expired coupon." });
                    }
                }

                decimal tax = subtotal * req.TaxRate;
                decimal total = subtotal + tax + req.DeliveryFee;

                var order = new Order
                {
                    UserID = req.UserId,
                    Email = req.Email,
                    ShippingAddress = req.ShippingAddress,
                    PaymentMethod = req.PaymentMethod,
                    DeliveryFee = req.DeliveryFee,
                    SubtotalAmount = subtotal,
                    TaxAmount = tax,
                    TotalAmount = total,
                    OrderDate = DateTime.UtcNow,
                    Status = string.IsNullOrWhiteSpace(req.Status)
                        ? "Pending"
                        : req.Status,
                };

                var dal = new DALOrder();
                int orderId = dal.CreateOrder(order, orderItems);

                return Ok(new
                {
                    orderId,
                    subtotal,
                    tax,
                    delivery = req.DeliveryFee,
                    total,
                    itemCount = orderItems.Count
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Failed to create order", detail = ex.Message });
            }
        }

        // --- CUSTOMER ORDER HISTORY ---
        [HttpGet("history/{userId}")]
        public IActionResult GetHistory(int userId)
        {
            var dal = new DALOrder();
            var orders = dal.GetOrdersByUserId(userId);

            return Ok(orders.Select(o => new
            {
                orderId = o.OrderID,
                o.OrderDate,
                o.TotalAmount,
                o.Status
            }));
        }

        // --- SPECIFIC ORDER DETAILS ---
        [HttpGet("detail/{orderId}")]
        public IActionResult GetOrderDetails(int orderId)
        {
            var dal = new DALOrder();
            var order = dal.GetOrderDetails(orderId);

            if (order == null)
                return NotFound(new { message = "Order not found." });

            return Ok(order);
        }

        // --- USER UPDATES STATUS OF ORDER (rare use-case) ---
        [HttpPut("{orderId}/status")]
        public IActionResult UserUpdateOrderStatus(int orderId, [FromBody] UserOrderStatusUpdateRequest body)
        {
            var dal = new DALOrder();
            bool success = dal.UpdateOrderStatus(orderId, body.Status);

            if (!success)
                return NotFound(new { message = "Order not found." });

            return Ok(new { message = "Status updated.", body.Status });
        }

        // --- HEALTH CHECK ---
        [HttpGet("ping")]
        public IActionResult Ping() => Ok(new { status = "orders-api-ok", time = DateTime.UtcNow });
    }

    // UNIQUE DTOs FOR THIS CONTROLLER
    public class UserOrderStatusUpdateRequest
    {
        public string Status { get; set; }
    }

    public class OrderItemRequest
    {
        public string ISBN { get; set; }
        public string Title { get; set; }
        public string Author { get; set; }
        public decimal Price { get; set; }
        public int Quantity { get; set; }
    }

    public class OrderCreateRequest
    {
        public int UserId { get; set; }
        public string Email { get; set; }
        public string ShippingAddress { get; set; }
        public string PaymentMethod { get; set; }
        public decimal DeliveryFee { get; set; }
        public decimal TaxRate { get; set; } = 0.13m;
        public string CouponCode { get; set; }
        public string Status { get; set; } = "Pending";
        public List<OrderItemRequest> Items { get; set; }
    }
}
