using Microsoft.AspNetCore.Mvc;
using BookStoreReact.Server.Data;
using BookStoreReact.Server.Models;

namespace BookStoreReact.Server.Controllers
{
    [ApiController]
    [Route("api/admin/orders")]
    public class AdminOrdersController : ControllerBase
    {
        private readonly DALOrderAdmin _dal;

        public AdminOrdersController(IConfiguration config)
        {
            _dal = new DALOrderAdmin(config);
        }

        // GET: /api/admin/orders
        [HttpGet]
        public IActionResult GetOrders()
        {
            var orders = _dal.GetOrders();
            return Ok(orders);
        }

        // GET: /api/admin/orders/{orderId}/items
        [HttpGet("{orderId}/items")]
        public IActionResult GetOrderItems(int orderId)
        {
            var items = _dal.GetOrderItems(orderId);

            if (items == null || items.Count == 0)
                return NotFound(new { message = "No items found for this order." });

            return Ok(items);
        }

        // PUT: /api/admin/orders/{orderId}/status
        [HttpPut("{orderId}/status")]
        public IActionResult UpdateStatus(int orderId, [FromBody] AdminOrderStatusUpdateRequest body)
        {
            if (body == null || string.IsNullOrWhiteSpace(body.Status))
                return BadRequest(new { message = "Status cannot be empty." });

            // Validate allowed statuses (optional but recommended)
            var validStatuses = new[] { "Pending", "Processing", "Shipped", "Delivered", "Cancelled" };
            if (!validStatuses.Contains(body.Status))
                return BadRequest(new { message = "Invalid status value." });

            try
            {
                _dal.UpdateStatus(orderId, body.Status);
                return Ok(new { message = "Order status updated successfully." });
            }
            catch
            {
                return NotFound(new { message = "Order not found." });
            }
        }
    }

    // Admin-specific DTO (avoids Swagger schema conflicts)
    public class AdminOrderStatusUpdateRequest
    {
        public string Status { get; set; }
    }
}
