using Microsoft.AspNetCore.Mvc;
using Api.Services;
using Api.DTOs;
using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;

namespace Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class UsersController : ControllerBase
    {
        private readonly UserService _userService;

        public UsersController(UserService userService)
        {
            _userService = userService;
        }

        [HttpGet("customers")]
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult<List<UserListDto>>> GetCustomers()
        {
            var customers = await _userService.GetAllCustomersAsync();
            return Ok(customers);
        }

        [HttpDelete("delete-users")]
        public async Task<ActionResult> DeleteUsers([FromBody] BulkDeleteRequest request)
        {
            if (request.UserIds == null || request.UserIds.Count == 0)
            {
                return BadRequest("No user IDs provided");
            }

            await _userService.BulkDeleteUsersAsync(request.UserIds);
            return NoContent();
        }

        [HttpGet("me")]
        [Authorize]
        public async Task<ActionResult<UserDto>> GetMe()
        {
            var email = User?.Identity?.Name;
            if (string.IsNullOrEmpty(email))
                return Unauthorized();
            var user = await _userService.GetUserByEmailAsync(email);
            if (user == null)
                return NotFound();
            return Ok(user);
        }

        [HttpPut("me")]
        [Authorize]
        public async Task<ActionResult<UserDto>> UpdateMe([FromBody] UserDto dto)
        {
            var email = User?.Identity?.Name;
            if (string.IsNullOrEmpty(email))
                return Unauthorized();
            var updated = await _userService.UpdateUserByEmailAsync(email, dto);
            if (updated == null)
                return NotFound();
            return Ok(updated);
        }

        public class BulkDeleteRequest
        {
            public List<int> UserIds { get; set; }
        }
    }
} 