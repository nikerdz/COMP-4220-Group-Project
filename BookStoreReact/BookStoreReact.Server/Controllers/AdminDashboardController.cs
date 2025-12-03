using Microsoft.AspNetCore.Mvc;
using BookStoreReact.Server.Data;

namespace BookStoreReact.Server.Controllers
{
    [ApiController]
    [Route("api/admin/dashboard")]
    public class AdminDashboardController : ControllerBase
    {
        private readonly DALDashboard _dal;

        public AdminDashboardController(IConfiguration config)
        {
            _dal = new DALDashboard(config);
        }

        [HttpGet("stats")]
        public IActionResult GetStats()
        {
            return Ok(_dal.GetStats());
        }
    }
}
