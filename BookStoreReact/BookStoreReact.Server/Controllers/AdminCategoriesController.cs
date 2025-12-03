using Microsoft.AspNetCore.Mvc;
using BookStoreReact.Server.Data;
using BookStoreReact.Server.Models;

namespace BookStoreReact.Server.Controllers
{
    [ApiController]
    [Route("api/admin/categories")]
    public class AdminCategoriesController : ControllerBase
    {
        private readonly DALCategory _dal;

        public AdminCategoriesController(IConfiguration config)
        {
            _dal = new DALCategory(config);
        }

        // GET: api/admin/categories
        [HttpGet]
        public IActionResult GetCategories()
        {
            return Ok(_dal.GetAll());
        }

        // POST: api/admin/categories
        [HttpPost]
        public IActionResult AddCategory([FromBody] CategoryModel model)
        {
            if (string.IsNullOrWhiteSpace(model.Name))
                return BadRequest(new { error = "Category Name is required." });

            try
            {
                _dal.Add(model);
                return Ok(new { message = "Category added successfully." });
            }
            catch (Exception ex)
            {
                return BadRequest(new { error = ex.Message });
            }
        }

        // PUT: api/admin/categories/{id}
        [HttpPut("{id}")]
        public IActionResult UpdateCategory(int id, [FromBody] CategoryModel model)
        {
            if (id != model.CategoryID)
                return BadRequest(new { error = "CategoryID mismatch." });

            if (string.IsNullOrWhiteSpace(model.Name))
                return BadRequest(new { error = "Category Name is required." });

            try
            {
                _dal.Update(model);
                return Ok(new { message = "Category updated successfully." });
            }
            catch (Exception ex)
            {
                return BadRequest(new { error = ex.Message });
            }
        }

        // DELETE: api/admin/categories/{id}
        [HttpDelete("{id}")]
        public IActionResult DeleteCategory(int id)
        {
            try
            {
                _dal.Delete(id);
                return Ok(new { message = "Category deleted successfully." });
            }
            catch (Exception ex)
            {
                return BadRequest(new { error = ex.Message });
            }
        }
    }
}
