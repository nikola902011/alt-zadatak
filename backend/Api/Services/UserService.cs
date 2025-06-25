using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Api.Data;
using Api.DTOs;
using Microsoft.EntityFrameworkCore;

namespace Api.Services
{
    public class UserService
    {
        private readonly AppDbContext _context;

        public UserService(AppDbContext context)
        {
            _context = context;
        }

        public async Task<List<UserListDto>> GetAllCustomersAsync()
        {
            return await _context.Users
                .Where(u => u.Role == "Customer")
                .Select(u => new UserListDto
                {
                    Id = u.Id,
                    FirstName = u.FirstName,
                    LastName = u.LastName,
                    Email = u.Email,
                    ProfileImagePath = u.ProfileImagePath,
                    CreatedAt = u.CreatedAt
                })
                .ToListAsync();
        }

        public async Task BulkDeleteUsersAsync(List<int> userIds)
        {
            var usersToDelete = await _context.Users
                .Where(u => userIds.Contains(u.Id) && u.Role == "Customer")
                .ToListAsync();

            _context.Users.RemoveRange(usersToDelete);
            await _context.SaveChangesAsync();
        }

        public async Task<UserDto?> GetUserByEmailAsync(string email)
        {
            var user = await _context.Users.FirstOrDefaultAsync(u => u.Email == email);
            if (user == null) return null;
            return new UserDto
            {
                Id = user.Id,
                FirstName = user.FirstName,
                LastName = user.LastName,
                Email = user.Email,
                Username = user.Username,
                ProfileImagePath = user.ProfileImagePath,
                ContactNumber = user.ContactNumber
            };
        }

        public async Task<UserDto?> UpdateUserByEmailAsync(string email, UserDto dto)
        {
            var user = await _context.Users.FirstOrDefaultAsync(u => u.Email == email);
            if (user == null) return null;
            user.FirstName = dto.FirstName;
            user.LastName = dto.LastName;
            user.Email = dto.Email;
            user.ContactNumber = dto.ContactNumber;
            if (!string.IsNullOrEmpty(dto.ProfileImagePath))
                user.ProfileImagePath = dto.ProfileImagePath;
            
            await _context.SaveChangesAsync();
            return new UserDto
            {
                Id = user.Id,
                FirstName = user.FirstName,
                LastName = user.LastName,
                Email = user.Email,
                Username = user.Username,
                ProfileImagePath = user.ProfileImagePath,
                ContactNumber = user.ContactNumber
            };
        }
    }
} 