using Microsoft.AspNetCore.Mvc;
using BookStoreReact.Server.Data;
using BookStoreReact.Server.Models;

namespace BookStoreReact.Server.Controllers
{
    [ApiController]
    [Route("api/admin/books")]
    public class AdminBooksController : ControllerBase
    {
        private readonly DALBook _dal;

        public AdminBooksController(IConfiguration config)
        {
            _dal = new DALBook(config);
        }

        // GET: /api/admin/books
        [HttpGet]
        public IActionResult GetBooks()
        {
            return Ok(_dal.GetAllBooks());
        }

        // POST: /api/admin/books
        [HttpPost]
        public IActionResult AddBook([FromBody] BookModel model)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            int rows = _dal.AddBook(model);
            return rows > 0
                ? Ok(new { message = "Book added." })
                : BadRequest("Failed to add book.");
        }

        // PUT: /api/admin/books/{isbn}
        [HttpPut("{isbn}")]
        public IActionResult UpdateBook(string isbn, [FromBody] BookModel model)
        {
            if (isbn != model.ISBN)
                return BadRequest("ISBN mismatch.");

            int rows = _dal.UpdateBook(model);
            return rows > 0
                ? Ok(new { message = "Book updated." })
                : BadRequest("Failed to update book.");
        }

        // DELETE: /api/admin/books/{isbn}
        [HttpDelete("{isbn}")]
        public IActionResult DeleteBook(string isbn)
        {
            int rows = _dal.DeleteBook(isbn);
            return rows > 0
                ? Ok(new { message = "Book deleted." })
                : BadRequest("Failed to delete book.");
        }
    }
}
