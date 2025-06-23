namespace Api.DTOs
{
    public class ProductDto
    {
        public int? Id { get; set; } // Za update, može biti null kod add
        public string Name { get; set; }
        public decimal Price { get; set; }
        public string Category { get; set; }
        public string? ImagePath { get; set; }
    }
} 