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

        [HttpGet]
        public IActionResult GetUsers() => Ok(_dal.GetAll());

        [HttpPost]
        public IActionResult AddUser([FromBody] UserAdminModel model)
        {
            try
            {
                model.Type = "AD";
                _dal.Add(model);
                return Ok(new { message = "User added successfully." });
            }
            catch (Exception ex)
            {
                return BadRequest(new { error = ex.Message });
            }
        }

        [HttpPut("{id}")]
        public IActionResult UpdateUser(int id, [FromBody] UserAdminModel model)
        {
            if (id != model.UserID)
                return BadRequest(new { error = "UserID mismatch." });

            try
            {
                model.Type = "AD"; // enforce!
                _dal.Update(model);
                return Ok(new { message = "User updated successfully." });
            }
            catch (Exception ex)
            {
                return BadRequest(new { error = ex.Message });
            }
        }

        [HttpDelete("{id}")]
        public IActionResult DeleteUser(int id)
        {
            try
            {
                _dal.Delete(id);
                return Ok(new { message = "User deleted." });
            }
            catch (Exception ex)
            {
                return BadRequest(new { error = ex.Message });
            }
        }
    }
}
