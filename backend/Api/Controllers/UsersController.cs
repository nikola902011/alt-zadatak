using Microsoft.AspNetCore.Mvc;
using Api.Services;
using Api.DTOs;
using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;

namespace Api.Controllers
{
    [Authorize(Roles = "Admin")]
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
        public async Task<ActionResult<List<UserDto>>> GetCustomers()
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

        public class BulkDeleteRequest
        {
            public List<int> UserIds { get; set; }
        }
    }
} 