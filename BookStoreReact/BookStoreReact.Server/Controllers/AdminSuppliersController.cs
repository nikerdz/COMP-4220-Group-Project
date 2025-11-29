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

        // GET: /api/admin/suppliers
        [HttpGet]
        public IActionResult GetSuppliers()
        {
            var suppliers = _dal.GetAll();
            return Ok(suppliers);
        }

        // POST: /api/admin/suppliers
        [HttpPost]
        public IActionResult AddSupplier([FromBody] SupplierModel model)
        {
            if (model == null || string.IsNullOrWhiteSpace(model.Name))
                return BadRequest(new { message = "Supplier name cannot be empty." });

            _dal.Add(model);
            return Ok(new { message = "Supplier added successfully." });
        }

        // PUT: /api/admin/suppliers/{id}
        [HttpPut("{id}")]
        public IActionResult UpdateSupplier(int id, [FromBody] SupplierModel model)
        {
            if (model == null || string.IsNullOrWhiteSpace(model.Name))
                return BadRequest(new { message = "Supplier name cannot be empty." });

            try
            {
                _dal.Update(id, model);
                return Ok(new { message = "Supplier updated successfully." });
            }
            catch
            {
                return NotFound(new { message = "Supplier not found." });
            }
        }

        // DELETE: /api/admin/suppliers/{id}
        [HttpDelete("{id}")]
        public IActionResult DeleteSupplier(int id)
        {
            try
            {
                _dal.Delete(id);
                return Ok(new { message = "Supplier deleted successfully." });
            }
            catch
            {
                return NotFound(new { message = "Supplier not found." });
            }
        }
    }
}
