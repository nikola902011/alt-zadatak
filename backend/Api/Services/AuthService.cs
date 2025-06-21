using System.Threading.Tasks;
using Api.Data;
using Api.DTOs;
using Api.Helpers;
using Microsoft.EntityFrameworkCore;

namespace Api.Services
{
    public class AuthService
    {
        private readonly AppDbContext _context;
        public AuthService(AppDbContext context)
        {
            _context = context;
        }

        public async Task<Models.User> ValidateUserAsync(string email, string password)
        {
            var user = await _context.Users.FirstOrDefaultAsync(u => u.Email == email);
            if (user == null) return null;
            if (!PasswordHelper.VerifyPassword(password, user.PasswordHash)) return null;
            return user;
        }
    }
} 