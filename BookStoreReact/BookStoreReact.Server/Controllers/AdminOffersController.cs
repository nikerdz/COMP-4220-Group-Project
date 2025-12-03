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
        public IActionResult GetAll()
        {
            return Ok(_dal.GetAll());
        }

        [HttpPost]
        public IActionResult Add([FromBody] OfferModel model)
        {
            _dal.Add(model);
            return Ok(new { message = "Offer added successfully." });
        }

        [HttpPut("{id}")]
        public IActionResult Update(int id, [FromBody] OfferModel model)
        {
            if (id != model.CouponID)
                return BadRequest(new { error = "ID mismatch." });

            _dal.Update(model);
            return Ok(new { message = "Offer updated successfully." });
        }

        [HttpDelete("{id}")]
        public IActionResult Delete(int id)
        {
            _dal.Delete(id);
            return Ok(new { message = "Offer deleted successfully." });
        }
    }
}
