using Microsoft.AspNetCore.Mvc;
using BookStoreReact.Server.Data;
using BookStoreReact.Server.Models;

namespace BookStoreReact.Server.Controllers
{
    [ApiController]
    [Route("api/admin/offers")]
    public class AdminOffersController : ControllerBase
    {
        private readonly DALOffer _dal;

        public AdminOffersController(IConfiguration config)
        {
            _dal = new DALOffer(config);
        }

        [HttpGet]
        public IActionResult GetOffers()
        {
            return Ok(_dal.GetAll());
        }

        [HttpPost]
        public IActionResult AddOffer([FromBody] OfferModel model)
        {
            _dal.Add(model);
            return Ok(new { message = "Offer added successfully" });
        }

        [HttpPut("{id}")]
        public IActionResult UpdateOffer(int id, [FromBody] OfferModel model)
        {
            try
            {
                _dal.Update(id, model);
                return Ok(new { message = "Offer updated successfully" });
            }
            catch
            {
                return NotFound(new { message = "Offer not found" });
            }
        }

        [HttpDelete("{id}")]
        public IActionResult DeleteOffer(int id)
        {
            try
            {
                _dal.Delete(id);
                return Ok(new { message = "Offer deleted successfully" });
            }
            catch
            {
                return NotFound(new { message = "Offer not found" });
            }
        }
    }
}
