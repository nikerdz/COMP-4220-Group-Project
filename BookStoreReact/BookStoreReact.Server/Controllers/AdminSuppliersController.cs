using Microsoft.AspNetCore.Mvc;
using BookStoreReact.Server.Data;
using BookStoreReact.Server.Models;

namespace BookStoreReact.Server.Controllers
{
    [ApiController]
    [Route("api/admin/suppliers")]
    public class AdminSuppliersController : ControllerBase
    {
        private readonly DALSupplier _dal;

        public AdminSuppliersController(IConfiguration config)
        {
            _dal = new DALSupplier(config);
        }

        [HttpGet]
        public IActionResult GetSuppliers()
        {
            return Ok(_dal.GetAll());
        }

        [HttpPost]
        public IActionResult AddSupplier([FromBody] SupplierModel model)
        {
            try
            {
                _dal.Add(model);
                return Ok(new { message = "Supplier added successfully." });
            }
            catch (Exception ex)
            {
                return BadRequest(new { error = ex.Message });
            }
        }

        [HttpPut("{id}")]
        public IActionResult UpdateSupplier(int id, [FromBody] SupplierModel model)
        {
            if (id != model.SupplierID)
                return BadRequest(new { error = "SupplierID mismatch." });

            try
            {
                _dal.Update(model);
                return Ok(new { message = "Supplier updated successfully." });
            }
            catch (Exception ex)
            {
                return BadRequest(new { error = ex.Message });
            }
        }

        [HttpDelete("{id}")]
        public IActionResult DeleteSupplier(int id)
        {
            try
            {
                _dal.Delete(id);
                return Ok(new { message = "Supplier deleted." });
            }
            catch (Exception ex)
            {
                return BadRequest(new { error = ex.Message });
            }
        }
    }
}
