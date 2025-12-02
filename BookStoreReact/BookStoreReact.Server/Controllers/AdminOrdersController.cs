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

        [HttpGet]
        public IActionResult GetOrders()
        {
            return Ok(_dal.GetAll());
        }

        [HttpPost]
        public IActionResult AddOrder([FromBody] OrderAdminModel model)
        {
            try
            {
                _dal.Add(model);
                return Ok(new { message = "Order added successfully." });
            }
            catch (Exception ex)
            {
                return BadRequest(new { error = ex.Message });
            }
        }

        [HttpPut("{id}")]
        public IActionResult UpdateOrder(int id, [FromBody] OrderAdminModel model)
        {
            if (id != model.OrderID)
                return BadRequest(new { error = "OrderID mismatch." });

            try
            {
                _dal.Update(model);
                return Ok(new { message = "Order updated successfully." });
            }
            catch (Exception ex)
            {
                return BadRequest(new { error = ex.Message });
            }
        }

        [HttpDelete("{id}")]
        public IActionResult DeleteOrder(int id)
        {
            try
            {
                _dal.Delete(id);
                return Ok(new { message = "Order deleted successfully." });
            }
            catch (Exception ex)
            {
                return BadRequest(new { error = ex.Message });
            }
        }
    }
}
