using System.ComponentModel.DataAnnotations;

namespace Api.DTOs
{
    public class UserDto
    {
        public int Id { get; set; }
        
        [Required(ErrorMessage = "First name is required")]
        [StringLength(50, ErrorMessage = "First name cannot exceed 50 characters")]
        public string FirstName { get; set; }
        
        [Required(ErrorMessage = "Last name is required")]
        [StringLength(50, ErrorMessage = "Last name cannot exceed 50 characters")]
        public string LastName { get; set; }
        
        [Required(ErrorMessage = "Email is required")]
        [EmailAddress(ErrorMessage = "Invalid email format")]
        public string Email { get; set; }
        
        [StringLength(50, ErrorMessage = "Username cannot exceed 50 characters")]
        public string? Username { get; set; }
        
        public string? ProfileImagePath { get; set; }
        
        [StringLength(20, ErrorMessage = "Contact number cannot exceed 20 characters")]
        public string? ContactNumber { get; set; }
        
        [StringLength(100, MinimumLength = 8, ErrorMessage = "Password must be at least 8 characters long")]
        public string? Password { get; set; }
    }
} 