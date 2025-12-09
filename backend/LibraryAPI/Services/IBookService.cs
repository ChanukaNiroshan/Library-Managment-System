using LibraryAPI.DTOs;
using LibraryAPI.Models;

namespace LibraryAPI.Services
{
    public interface IBookService
    {
        Task<BookResponseDto> CreateBookAsync(BookCreateDto bookDto);
        Task<IEnumerable<BookResponseDto>> GetAllBooksAsync();
        Task<BookResponseDto?> GetBookByIdAsync(int id);
        Task<BookResponseDto?> UpdateBookAsync(int id, BookUpdateDto bookDto);
        Task<bool> DeleteBookAsync(int id);
        Task<IEnumerable<BookResponseDto>> SearchBooksAsync(string searchTerm);
    }
}