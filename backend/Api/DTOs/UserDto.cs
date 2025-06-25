namespace Api.DTOs
{
    public class UserDto
    {
        public int Id { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string Email { get; set; }
        public string? Username { get; set; }
        public string? ProfileImagePath { get; set; }
        public string? ContactNumber { get; set; }
    }
} 