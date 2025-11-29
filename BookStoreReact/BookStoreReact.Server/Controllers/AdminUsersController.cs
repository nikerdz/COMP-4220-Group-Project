using Microsoft.AspNetCore.Mvc;
using BookStoreReact.Server.Data;
using BookStoreReact.Server.Models;

namespace BookStoreReact.Server.Controllers
{
    [ApiController]
    [Route("api/admin/users")]
    public class AdminUsersController : ControllerBase
    {
        private readonly DALUserAdmin _dal;

        public AdminUsersController(IConfiguration config)
        {
            _dal = new DALUserAdmin(config);
        }

        // GET: /api/admin/users
        [HttpGet]
        public IActionResult GetUsers()
        {
            return Ok(_dal.GetAll());
        }

        // POST: /api/admin/users
        [HttpPost]
        public IActionResult AddUser([FromBody] UserAdminModel model)
        {
            if (model == null)
                return BadRequest(new { message = "Invalid user data." });

            if (string.IsNullOrWhiteSpace(model.UserName))
                return BadRequest(new { message = "Username cannot be empty." });

            if (string.IsNullOrWhiteSpace(model.Password))
                return BadRequest(new { message = "Password cannot be empty." });

            if (string.IsNullOrWhiteSpace(model.Type))
                return BadRequest(new { message = "User type must be provided." });

            _dal.AddUser(model);

            return Ok(new { message = "User created successfully." });
        }

        // PUT: /api/admin/users/{id}
        [HttpPut("{id}")]
        public IActionResult UpdateUser(int id, [FromBody] UserAdminModel model)
        {
            if (model == null)
                return BadRequest(new { message = "Invalid user data." });

            try
            {
                _dal.UpdateUser(id, model);
                return Ok(new { message = "User updated successfully." });
            }
            catch
            {
                return NotFound(new { message = "User not found." });
            }
        }

        // DELETE: /api/admin/users/{id}
        [HttpDelete("{id}")]
        public IActionResult DeleteUser(int id)
        {
            try
            {
                _dal.DeleteUser(id);
                return Ok(new { message = "User deleted successfully." });
            }
            catch
            {
                return NotFound(new { message = "User not found." });
            }
        }
    }
}
