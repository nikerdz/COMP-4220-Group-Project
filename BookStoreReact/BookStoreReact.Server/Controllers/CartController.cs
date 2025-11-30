using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using BookStoreReact.Server.Data;
using BookStoreReact.Server.Models;

namespace BookStoreReact.Server.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class CartController : ControllerBase
    {
        [HttpGet("{userId:int}")]
        public IActionResult GetCart(int userId)
        {
            Console.WriteLine($"[CartController] GetCart called for userId: {userId}");
            try
            {
                var items = CartDAL.GetCartItems(userId);
                Console.WriteLine($"[CartController] GetCart found {items.Count} items");
                return Ok(items);
            }
            catch (Exception ex)
            {
                Console.WriteLine($"[CartController] GetCart error: {ex.Message}");
                return StatusCode(500, new { message = "Error retrieving cart", error = ex.Message });
            }
        }

        [HttpPost("add")]
        public IActionResult AddToCart([FromBody] CartItemRequest request)
        {
            Console.WriteLine($"[CartController] AddToCart called for userId: {request.UserId}, ISBN: {request.ISBN}");
            try
            {
                bool success = CartDAL.AddItemToCart(request.UserId, request.ISBN, request.Quantity);
                Console.WriteLine($"[CartController] AddToCart success: {success}");
                if (success)
                    return Ok(new { message = "Item added to cart" });
                return BadRequest(new { message = "Failed to add item" });
            }
            catch (Exception ex)
            {
                Console.WriteLine($"[CartController] AddToCart error: {ex.Message}");
                return StatusCode(500, new { message = "Error adding item", error = ex.Message });
            }
        }

        [HttpPost("remove")]
        public IActionResult RemoveFromCart([FromBody] CartItemRequest request)
        {
            Console.WriteLine($"[CartController] RemoveFromCart called for userId: {request.UserId}, ISBN: {request.ISBN}");
            try
            {
                bool success = CartDAL.RemoveItemFromCart(request.UserId, request.ISBN, request.Quantity);
                Console.WriteLine($"[CartController] RemoveFromCart success: {success}");
                if (success)
                    return Ok(new { message = "Item removed from cart" });
                return BadRequest(new { message = "Failed to remove item" });
            }
            catch (Exception ex)
            {
                Console.WriteLine($"[CartController] RemoveFromCart error: {ex.Message}");
                return StatusCode(500, new { message = "Error removing item", error = ex.Message });
            }
        }

        [HttpPut("update")]
        public IActionResult UpdateQuantity([FromBody] CartItemRequest request)
        {
            Console.WriteLine($"[CartController] UpdateQuantity called for userId: {request.UserId}, ISBN: {request.ISBN}, Qty: {request.Quantity}");
            try
            {
                bool success = CartDAL.UpdateCartItemQuantity(request.UserId, request.ISBN, request.Quantity);
                Console.WriteLine($"[CartController] UpdateQuantity success: {success}");
                if (success)
                    return Ok(new { message = "Cart updated" });
                return BadRequest(new { message = "Failed to update cart" });
            }
            catch (Exception ex)
            {
                Console.WriteLine($"[CartController] UpdateQuantity error: {ex.Message}");
                return StatusCode(500, new { message = "Error updating cart", error = ex.Message });
            }
        }

        [HttpPost("clear")]
        public IActionResult ClearCart([FromBody] CartItemRequest request)
        {
            Console.WriteLine($"[CartController] ClearCart called for userId: {request.UserId}");
            try
            {
                bool success = CartDAL.ClearCart(request.UserId);
                Console.WriteLine($"[CartController] ClearCart success: {success}");
                if (success)
                    return Ok(new { message = "Cart cleared" });
                return BadRequest(new { message = "Failed to clear cart" });
            }
            catch (Exception ex)
            {
                Console.WriteLine($"[CartController] ClearCart error: {ex.Message}");
                return StatusCode(500, new { message = "Error clearing cart", error = ex.Message });
            }
        }

        [HttpGet("subtotal/{userId:int}")]
        public IActionResult GetSubtotal(int userId)
        {
            try
            {
                decimal subtotal = CartDAL.GetCartSubtotal(userId);
                return Ok(new { subtotal });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Error calculating subtotal", error = ex.Message });
            }
        }
    }

    public class CartItemRequest
    {
        public int UserId { get; set; }
        public string ISBN { get; set; }
        public int Quantity { get; set; }
    }
}
