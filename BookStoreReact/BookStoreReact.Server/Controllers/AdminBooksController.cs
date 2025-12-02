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
        [HttpPost]
        public IActionResult AddBook([FromBody] BookModel model)
        {
            try
            {
                _dal.AddBook(model);
                return Ok(new { message = "Book added successfully." });
            }
            catch (Exception ex)
            {
                Console.WriteLine("🔥 BOOK ADD ERROR (RAW):");
                Console.WriteLine(ex.ToString());

                // return EVERYTHING (temporarily!)
                return BadRequest(new
                {
                    error = ex.Message,
                    details = ex.ToString()
                });
            }
        }


        // PUT: /api/admin/books/{isbn}
        [HttpPut("{isbn}")]
        public IActionResult UpdateBook(string isbn, [FromBody] BookModel model)
        {
            if (model == null)
                return BadRequest(new { error = "Book data is missing." });

            if (!string.Equals(isbn, model.ISBN, StringComparison.OrdinalIgnoreCase))
                return BadRequest(new { error = "ISBN mismatch between URL and payload." });

            try
            {
                _dal.UpdateBook(model);
                return Ok(new { message = "Book updated successfully." });
            }
            catch (Exception ex)
            {
                return BadRequest(new { error = ex.Message });
            }
        }

        // DELETE: /api/admin/books/{isbn}
        [HttpDelete("{isbn}")]
        public IActionResult DeleteBook(string isbn)
        {
            if (string.IsNullOrWhiteSpace(isbn) || isbn.Length != 10)
                return BadRequest(new { error = "Invalid ISBN." });

            try
            {
                _dal.DeleteBook(isbn);
                return Ok(new { message = "Book deleted successfully." });
            }
            catch (Exception ex)
            {
                return BadRequest(new { error = ex.Message });
            }
        }
    }
}
