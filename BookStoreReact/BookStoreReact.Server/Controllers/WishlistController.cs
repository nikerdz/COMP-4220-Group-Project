using Microsoft.AspNetCore.Mvc;
using BookStoreReact.Server.Data;

namespace BookStoreReact.Server.Controllers
{
    [ApiController]
    [Route("api/wishlist")]
    public class WishlistController : ControllerBase
    {
        [HttpPost("add")]
        public IActionResult Add([FromBody] WishlistAddRequest req)
        {
            var dal = new DALWishlist();
            int rows = dal.AddToWishlist(req.UserId, req.ISBN);

            if (rows < 1)
                return BadRequest(new { message = "Already exists or failed" });

            return Ok(new { message = "Added" });
        }

        [HttpDelete("remove")]
        public IActionResult Remove([FromBody] WishlistAddRequest req)
        {
            var dal = new DALWishlist();
            int rows = dal.RemoveFromWishlist(req.UserId, req.ISBN);

            if (rows < 1)
                return NotFound(new { message = "Not found" });

            return Ok(new { message = "Removed" });
        }

        [HttpGet("{userId}")]
        public IActionResult Get(int userId)
        {
            var dal = new DALWishlist();
            var items = dal.GetWishlist(userId); // List<WishlistItemModel>
            return Ok(items);
        }
    }

    public class WishlistAddRequest
    {
        public int UserId { get; set; }
        public string ISBN { get; set; }
    }
}
