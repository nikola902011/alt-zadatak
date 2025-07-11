using System.ComponentModel.DataAnnotations;

namespace Api.DTOs
{
    public class LoginDto
    {
        [Required(ErrorMessage = "Email is required")]
        [EmailAddress(ErrorMessage = "Invalid email format")]
        public string Email { get; set; }
        
        [Required(ErrorMessage = "Password is required")]
        [StringLength(100, MinimumLength = 1, ErrorMessage = "Password is required")]
        public string Password { get; set; }
    }
} 