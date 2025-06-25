using System.ComponentModel.DataAnnotations;

namespace Api.DTOs
{
    public class ProductDto
    {
        public int? Id { get; set; } // Za update, može biti null kod add
        
        [Required(ErrorMessage = "Product name is required")]
        [StringLength(100, ErrorMessage = "Product name cannot exceed 100 characters")]
        public string Name { get; set; }
        
        [Required(ErrorMessage = "Price is required")]
        [Range(0.01, double.MaxValue, ErrorMessage = "Price must be greater than 0")]
        public decimal Price { get; set; }
        
        [Required(ErrorMessage = "Category is required")]
        public string Category { get; set; }
        
        public string? ImagePath { get; set; }
    }
} 