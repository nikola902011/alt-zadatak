using System.Threading.Tasks;
using Api.Data;
using Api.DTOs;
using Microsoft.EntityFrameworkCore;

namespace Api.Services
{
    public class DashboardService
    {
        private readonly AppDbContext _context;

        public DashboardService(AppDbContext context)
        {
            _context = context;
        }

        public async Task<DashboardStatsDto> GetDashboardStatsAsync()
        {
            var totalProducts = await _context.Products.CountAsync();
            var activeUsers = await _context.Users.Where(u => u.Role == "Customer").CountAsync();

            return new DashboardStatsDto
            {
                TotalProducts = totalProducts,
                ActiveUsers = activeUsers
            };
        }
    }
} 