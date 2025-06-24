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

        public async Task<List<UserDto>> GetAllCustomersAsync()
        {
            return await _context.Users
                .Where(u => u.Role == "Customer")
                .Select(u => new UserDto
                {
                    Id = u.Id,
                    FirstName = u.FirstName,
                    LastName = u.LastName,
                    Email = u.Email,
                    CreatedAt = u.CreatedAt,
                    ProfileImagePath = u.ProfileImagePath
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
    }
} 