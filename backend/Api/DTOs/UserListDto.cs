namespace Api.DTOs
{
    public class UserListDto
    {
        public int Id { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string Email { get; set; }
        public string? ProfileImagePath { get; set; }
        public DateTime CreatedAt { get; set; }
    }
} 