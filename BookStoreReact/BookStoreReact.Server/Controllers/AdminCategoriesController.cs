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


        // GET ALL CATEGORIES

        [HttpGet]
        public IActionResult GetCategories()
        {
            return Ok(_dal.GetAll());
        }



        // ADD NEW CATEGORY

        [HttpPost]
        public IActionResult AddCategory([FromBody] CategoryModel model)
        {
            if (model == null || string.IsNullOrWhiteSpace(model.Name))
                return BadRequest(new { message = "Category name is required." });

            _dal.Add(model);
            return Ok(new { message = "Category added successfully." });
        }



        // UPDATE CATEGORY

        [HttpPut("{id}")]
        public IActionResult UpdateCategory(int id, [FromBody] CategoryModel model)
        {
            if (id <= 0)
                return BadRequest(new { message = "Invalid Category ID." });

            if (model == null || string.IsNullOrWhiteSpace(model.Name))
                return BadRequest(new { message = "Category name is required." });

            _dal.Update(id, model);
            return Ok(new { message = "Category updated successfully." });
        }



        // DELETE CATEGORY

        [HttpDelete("{id}")]
        public IActionResult DeleteCategory(int id)
        {
            if (id <= 0)
                return BadRequest(new { message = "Invalid Category ID." });

            _dal.Delete(id);
            return Ok(new { message = "Category deleted successfully." });
        }
    }
}
