using System;
using System.Collections.Generic;
using System.Linq;
using Microsoft.AspNetCore.Mvc;
using BookStoreReact.Server.Models;
using BookStoreReact.Server.Data;

namespace BookStoreReact.Server.Controllers
{
    [ApiController]
    [Route("api/orders")]
    public class OrderController : ControllerBase
    {
        /// <summary>
        /// Request model for creating a new order
        /// </summary>
        public class CreateOrderRequest
        {
            public int UserId { get; set; }
            public string Email { get; set; } = "";
            public string ShippingAddress { get; set; } = "";
            public string PaymentMethod { get; set; } = ""; // Last 4 digits or card type
            public decimal DeliveryFee { get; set; } = 0m;
            public decimal TaxRate { get; set; } = 0.13m;
            public string CouponCode { get; set; } // Added for coupon support
            public List<OrderItemRequest> Items { get; set; } = new List<OrderItemRequest>();
        }

        public class OrderItemRequest
        {
            public string ISBN { get; set; } = "";
            public string Title { get; set; } = "";
            public string Author { get; set; } = "";
            public decimal Price { get; set; }
            public int Quantity { get; set; } = 1;
        }

        /// <summary>
        /// Validate a coupon code
        /// POST /api/orders/validate-coupon
        /// </summary>
        [HttpPost("validate-coupon")]
        public IActionResult ValidateCoupon([FromBody] string couponCode)
        {
            try
            {
                if (string.IsNullOrWhiteSpace(couponCode))
                    return BadRequest(new { message = "Coupon code is required." });

                var coupon = CouponDAL.LoadCoupon(couponCode);
                var couponInstance = new Coupon();

                if (coupon != null && couponInstance.ValidateCoupon(coupon))
                {
                    return Ok(new
                    {
                        success = true,
                        code = coupon.Code,
                        discountRate = coupon.DiscountRate,
                        description = coupon.Description,
                        message = "Coupon applied successfully!"
                    });
                }
                else
                {
                    return BadRequest(new { message = "Invalid or expired coupon code." });
                }
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Error validating coupon.", detail = ex.Message });
            }
        }

        /// <summary>
        /// Create a new order
        /// POST /api/orders/create
        /// </summary>
        [HttpPost("create")]
        public IActionResult CreateOrder([FromBody] CreateOrderRequest req)
        {
            try
            {
                // Validate request
                if (req.UserId <= 0)
                    return BadRequest(new { message = "Invalid user ID." });

                if (req.Items == null || req.Items.Count == 0)
                    return BadRequest(new { message = "Order must contain at least one item." });

                // Calculate totals
                decimal subtotal = 0;
                var orderItems = new List<OrderItem>();

                foreach (var item in req.Items)
                {
                    if (item.Quantity <= 0)
                        return BadRequest(new { message = $"Invalid quantity for item: {item.Title}" });

                    if (item.Price < 0)
                        return BadRequest(new { message = $"Invalid price for item: {item.Title}" });

                    var orderItem = new OrderItem
                    {
                        ISBN = item.ISBN,
                        Title = item.Title,
                        Author = item.Author,
                        Price = item.Price,
                        Quantity = item.Quantity,
                        Subtotal = item.Price * item.Quantity
                    };

                    subtotal += orderItem.Subtotal;
                    orderItems.Add(orderItem);
                }

                // Apply Coupon if provided
                if (!string.IsNullOrWhiteSpace(req.CouponCode))
                {
                    var coupon = CouponDAL.LoadCoupon(req.CouponCode);
                    var couponInstance = new Coupon(); // Needed to call instance methods if they are not static
                    
                    // Check if coupon exists and is valid
                    if (coupon != null && couponInstance.ValidateCoupon(coupon))
                    {
                        // ApplyDiscount returns the NEW subtotal (e.g., 80 -> 56)
                        subtotal = couponInstance.ApplyDiscount(subtotal, coupon);
                        
                        // Ensure subtotal doesn't go negative (though logic shouldn't allow it)
                        if (subtotal < 0) subtotal = 0;

                        // Increment usage
                        CouponDAL.IncrementUsage(coupon.CouponID);
                    }
                    else
                    {
                        return BadRequest(new { message = "Invalid or expired coupon code." });
                    }
                }

                decimal taxAmount = subtotal * req.TaxRate;
                decimal totalAmount = subtotal + taxAmount + req.DeliveryFee;

                // Create order object
                var order = new Order
                {
                    UserID = req.UserId,
                    OrderDate = DateTime.UtcNow,
                    SubtotalAmount = subtotal,
                    TaxAmount = taxAmount,
                    DeliveryFee = req.DeliveryFee,
                    TotalAmount = totalAmount,
                    Status = "Pending",
                    ShippingAddress = req.ShippingAddress,
                    PaymentMethod = req.PaymentMethod,
                    Email = req.Email
                };

                // Save to database
                var dal = new DALOrder();
                int orderId = dal.CreateOrder(order, orderItems);

                return Ok(new
                {
                    orderId = orderId,
                    orderDate = order.OrderDate,
                    subtotal = subtotal,
                    taxes = taxAmount,
                    delivery = req.DeliveryFee,
                    totalAmount = totalAmount,
                    itemCount = orderItems.Count,
                    status = "Pending"
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Error creating order.", detail = ex.Message });
            }
        }

        /// <summary>
        /// Get order history for a user
        /// GET /api/orders/history/{userId}
        /// </summary>
        [HttpGet("history/{userId:int}")]
        public IActionResult GetOrderHistory(int userId)
        {
            try
            {
                if (userId <= 0)
                    return BadRequest(new { message = "Invalid user ID." });

                var dal = new DALOrder();
                var orders = dal.GetOrdersByUserId(userId);

                // Transform to summary format
                var orderSummaries = orders.Select(o => new
                {
                    orderId = o.OrderID,
                    orderDate = o.OrderDate,
                    totalAmount = o.TotalAmount,
                    status = o.Status,
                    itemCount = o.Items?.Count ?? 0
                }).ToList();

                return Ok(orderSummaries);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Error retrieving order history.", detail = ex.Message });
            }
        }

        /// <summary>
        /// Get detailed information for a specific order
        /// GET /api/orders/detail/{orderId}
        /// </summary>
        [HttpGet("detail/{orderId:int}")]
        public IActionResult GetOrderDetails(int orderId)
        {
            try
            {
                if (orderId <= 0)
                    return BadRequest(new { message = "Invalid order ID." });

                var dal = new DALOrder();
                var order = dal.GetOrderDetails(orderId);

                if (order == null)
                    return NotFound(new { message = "Order not found." });

                // Transform to response format
                var response = new
                {
                    order = new
                    {
                        orderId = order.OrderID,
                        userId = order.UserID,
                        orderDate = order.OrderDate,
                        subtotal = order.SubtotalAmount,
                        tax = order.TaxAmount,
                        delivery = order.DeliveryFee,
                        total = order.TotalAmount,
                        status = order.Status,
                        shippingAddress = order.ShippingAddress,
                        paymentMethod = order.PaymentMethod,
                        email = order.Email
                    },
                    items = order.Items.Select(i => new
                    {
                        orderItemId = i.OrderItemID,
                        isbn = i.ISBN,
                        title = i.Title,
                        author = i.Author,
                        price = i.Price,
                        quantity = i.Quantity,
                        subtotal = i.Subtotal
                    }).ToList()
                };

                return Ok(response);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Error retrieving order details.", detail = ex.Message });
            }
        }

        /// <summary>
        /// Update order status (for admin/manager use)
        /// PUT /api/orders/{orderId}/status
        /// </summary>
        public class UpdateStatusRequest
        {
            public string Status { get; set; } = "";
        }

        [HttpPut("{orderId:int}/status")]
        public IActionResult UpdateOrderStatus(int orderId, [FromBody] UpdateStatusRequest req)
        {
            try
            {
                if (orderId <= 0)
                    return BadRequest(new { message = "Invalid order ID." });

                if (string.IsNullOrWhiteSpace(req.Status))
                    return BadRequest(new { message = "Status is required." });

                // Validate status values
                var validStatuses = new[] { "Pending", "Processing", "Shipped", "Delivered", "Cancelled" };
                if (!validStatuses.Contains(req.Status))
                    return BadRequest(new { message = "Invalid status. Valid values: Pending, Processing, Shipped, Delivered, Cancelled" });

                var dal = new DALOrder();
                bool updated = dal.UpdateOrderStatus(orderId, req.Status);

                if (!updated)
                    return NotFound(new { message = "Order not found." });

                return Ok(new { message = "Order status updated successfully.", status = req.Status });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Error updating order status.", detail = ex.Message });
            }
        }

        /// <summary>
        /// Health check endpoint
        /// GET /api/orders/ping
        /// </summary>
        [HttpGet("ping")]
        public IActionResult Ping()
        {
            return Ok(new
            {
                status = "orders-api-ok",
                time = DateTime.UtcNow,
                message = "Order API is running"
            });
        }
    }
}
