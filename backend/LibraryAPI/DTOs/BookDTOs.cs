using System.ComponentModel.DataAnnotations;

namespace LibraryAPI.DTOs
{
    public class BookCreateDto
    {
        [Required]
        [StringLength(200, MinimumLength = 1)]
        public string Title { get; set; } = string.Empty;

        [Required]
        [StringLength(150, MinimumLength = 1)]
        public string Author { get; set; } = string.Empty;

        [StringLength(1000)]
        public string Description { get; set; } = string.Empty;

        [StringLength(20)]
        public string? ISBN { get; set; }

        [Range(1000, 2100)]
        public int? PublicationYear { get; set; }
    }

    public class BookUpdateDto
    {
        [StringLength(200, MinimumLength = 1)]
        public string? Title { get; set; }

        [StringLength(150, MinimumLength = 1)]
        public string? Author { get; set; }

        [StringLength(1000)]
        public string? Description { get; set; }

        [StringLength(20)]
        public string? ISBN { get; set; }

        [Range(1000, 2100)]
        public int? PublicationYear { get; set; }
    }

    public class BookResponseDto
    {
        public int Id { get; set; }
        public string Title { get; set; } = string.Empty;
        public string Author { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public string? ISBN { get; set; }
        public int? PublicationYear { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime? UpdatedAt { get; set; }
    }
}