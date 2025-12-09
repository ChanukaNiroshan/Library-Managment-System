using Microsoft.EntityFrameworkCore;
using LibraryAPI.Data;
using LibraryAPI.DTOs;
using LibraryAPI.Models;

namespace LibraryAPI.Services
{
    public class BookService : IBookService
    {
        private readonly ApplicationDbContext _context;
        private readonly ILogger<BookService> _logger;

        public BookService(ApplicationDbContext context, ILogger<BookService> logger)
        {
            _context = context;
            _logger = logger;
        }

        public async Task<BookResponseDto> CreateBookAsync(BookCreateDto bookDto)
        {
            // Check for duplicate ISBN if provided
            if (!string.IsNullOrWhiteSpace(bookDto.ISBN))
            {
                var existingBook = await _context.Books
                    .FirstOrDefaultAsync(b => b.ISBN == bookDto.ISBN);
                
                if (existingBook != null)
                {
                    throw new InvalidOperationException($"A book with ISBN '{bookDto.ISBN}' already exists.");
                }
            }

            var book = new Book
            {
                Title = bookDto.Title,
                Author = bookDto.Author,
                Description = bookDto.Description,
                ISBN = bookDto.ISBN,
                PublicationYear = bookDto.PublicationYear,
                CreatedAt = DateTime.UtcNow
            };

            _context.Books.Add(book);
            await _context.SaveChangesAsync();

            _logger.LogInformation($"Book created: {book.Title} by {book.Author}");

            return MapToDto(book);
        }

        public async Task<IEnumerable<BookResponseDto>> GetAllBooksAsync()
        {
            var books = await _context.Books
                .OrderByDescending(b => b.CreatedAt)
                .ToListAsync();

            return books.Select(MapToDto);
        }

        public async Task<BookResponseDto?> GetBookByIdAsync(int id)
        {
            var book = await _context.Books.FindAsync(id);
            return book != null ? MapToDto(book) : null;
        }

        public async Task<BookResponseDto?> UpdateBookAsync(int id, BookUpdateDto bookDto)
        {
            var book = await _context.Books.FindAsync(id);
            if (book == null) return null;

            // Check for duplicate ISBN if it's being updated
            if (!string.IsNullOrWhiteSpace(bookDto.ISBN) && bookDto.ISBN != book.ISBN)
            {
                var existingBook = await _context.Books
                    .FirstOrDefaultAsync(b => b.ISBN == bookDto.ISBN);
                
                if (existingBook != null)
                {
                    throw new InvalidOperationException($"A book with ISBN '{bookDto.ISBN}' already exists.");
                }
            }

            if (!string.IsNullOrWhiteSpace(bookDto.Title))
                book.Title = bookDto.Title;
            
            if (!string.IsNullOrWhiteSpace(bookDto.Author))
                book.Author = bookDto.Author;
            
            if (bookDto.Description != null)
                book.Description = bookDto.Description;
            
            if (bookDto.ISBN != null)
                book.ISBN = bookDto.ISBN;
            
            if (bookDto.PublicationYear.HasValue)
                book.PublicationYear = bookDto.PublicationYear.Value;
            
            book.UpdatedAt = DateTime.UtcNow;

            await _context.SaveChangesAsync();
            _logger.LogInformation($"Book updated: {book.Title}");

            return MapToDto(book);
        }

        public async Task<bool> DeleteBookAsync(int id)
        {
            var book = await _context.Books.FindAsync(id);
            if (book == null) return false;

            _context.Books.Remove(book);
            await _context.SaveChangesAsync();

            _logger.LogInformation($"Book deleted: {book.Title}");
            return true;
        }

        public async Task<IEnumerable<BookResponseDto>> SearchBooksAsync(string searchTerm)
        {
            if (string.IsNullOrWhiteSpace(searchTerm))
                return await GetAllBooksAsync();

            var books = await _context.Books
                .Where(b => b.Title.Contains(searchTerm) || 
                           b.Author.Contains(searchTerm) ||
                           b.Description.Contains(searchTerm) ||
                           (b.ISBN != null && b.ISBN.Contains(searchTerm)))
                .OrderByDescending(b => b.CreatedAt)
                .ToListAsync();

            return books.Select(MapToDto);
        }

        private static BookResponseDto MapToDto(Book book)
        {
            return new BookResponseDto
            {
                Id = book.Id,
                Title = book.Title,
                Author = book.Author,
                Description = book.Description,
                ISBN = book.ISBN,
                PublicationYear = book.PublicationYear,
                CreatedAt = book.CreatedAt,
                UpdatedAt = book.UpdatedAt
            };
        }
    }
}