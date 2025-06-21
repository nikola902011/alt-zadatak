﻿using System.ComponentModel.DataAnnotations;

namespace Api.Models
{
    public class Product
    {
        public int Id { get; set; }

        [Required]
        public string Name { get; set; }

        [Required]
        public decimal Price { get; set; }

        public string Category { get; set; }

        public string? ImagePath { get; set; } 
    }
}
