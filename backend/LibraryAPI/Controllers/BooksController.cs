using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using LibraryAPI.DTOs;
using LibraryAPI.Services;

namespace LibraryAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Produces("application/json")]
    public class BooksController : ControllerBase
    {
        private readonly IBookService _bookService;
        private readonly ILogger<BooksController> _logger;

        public BooksController(IBookService bookService, ILogger<BooksController> logger)
        {
            _bookService = bookService;
            _logger = logger;
        }

        /// <summary>
        /// Get all books
        /// </summary>
        [HttpGet]
        [ProducesResponseType(typeof(IEnumerable<BookResponseDto>), 200)]
        public async Task<ActionResult<IEnumerable<BookResponseDto>>> GetBooks([FromQuery] string? search)
        {
            try
            {
                IEnumerable<BookResponseDto> books;
                
                if (!string.IsNullOrEmpty(search))
                {
                    books = await _bookService.SearchBooksAsync(search);
                }
                else
                {
                    books = await _bookService.GetAllBooksAsync();
                }
                
                return Ok(books);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting books");
                return StatusCode(500, "An error occurred while processing your request");
            }
        }

        /// <summary>
        /// Get a specific book by ID
        /// </summary>
        /// <param name="id">Book ID</param>
        [HttpGet("{id}")]
        [ProducesResponseType(typeof(BookResponseDto), 200)]
        [ProducesResponseType(404)]
        public async Task<ActionResult<BookResponseDto>> GetBook(int id)
        {
            try
            {
                var book = await _bookService.GetBookByIdAsync(id);
                if (book == null)
                {
                    return NotFound($"Book with ID {id} not found");
                }
                return Ok(book);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Error getting book with ID {id}");
                return StatusCode(500, "An error occurred while processing your request");
            }
        }

        /// <summary>
        /// Create a new book
        /// </summary>
        [HttpPost]
        [Authorize] // Optional: Add authentication
        [ProducesResponseType(typeof(BookResponseDto), 201)]
        [ProducesResponseType(400)]
        [ProducesResponseType(409)]
        public async Task<ActionResult<BookResponseDto>> CreateBook(BookCreateDto bookDto)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    return BadRequest(ModelState);
                }

                var book = await _bookService.CreateBookAsync(bookDto);
                return CreatedAtAction(nameof(GetBook), new { id = book.Id }, book);
            }
            catch (InvalidOperationException ex)
            {
                _logger.LogWarning(ex, "Duplicate ISBN conflict");
                return Conflict(new { error = ex.Message });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error creating book");
                return StatusCode(500, "An error occurred while creating the book");
            }
        }

        /// <summary>
        /// Update an existing book
        /// </summary>
        /// <param name="id">Book ID</param>
        [HttpPut("{id}")]
        [Authorize] // Optional: Add authentication
        [ProducesResponseType(typeof(BookResponseDto), 200)]
        [ProducesResponseType(400)]
        [ProducesResponseType(404)]
        [ProducesResponseType(409)]
        public async Task<ActionResult<BookResponseDto>> UpdateBook(int id, BookUpdateDto bookDto)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    return BadRequest(ModelState);
                }

                var updatedBook = await _bookService.UpdateBookAsync(id, bookDto);
                if (updatedBook == null)
                {
                    return NotFound($"Book with ID {id} not found");
                }

                return Ok(updatedBook);
            }
            catch (InvalidOperationException ex)
            {
                _logger.LogWarning(ex, "Duplicate ISBN conflict");
                return Conflict(new { error = ex.Message });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Error updating book with ID {id}");
                return StatusCode(500, "An error occurred while updating the book");
            }
        }

        /// <summary>
        /// Delete a book
        /// </summary>
        /// <param name="id">Book ID</param>
        [HttpDelete("{id}")]
        [Authorize] // Optional: Add authentication
        [ProducesResponseType(204)]
        [ProducesResponseType(404)]
        public async Task<IActionResult> DeleteBook(int id)
        {
            try
            {
                var result = await _bookService.DeleteBookAsync(id);
                if (!result)
                {
                    return NotFound($"Book with ID {id} not found");
                }

                return NoContent();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Error deleting book with ID {id}");
                return StatusCode(500, "An error occurred while deleting the book");
            }
        }
    }
}