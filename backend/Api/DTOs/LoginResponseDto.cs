namespace Api.DTOs
{
    public class LoginResponseDto
    {
        public string Token { get; set; }
        public string Email { get; set; }
        public string Role { get; set; }
        public string? ProfileImagePath { get; set; }
    }
} 