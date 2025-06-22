using Microsoft.AspNetCore.Mvc;
using Api.DTOs;
using Api.Services;
using Api.Helpers;

namespace Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly AuthService _authService;
        private readonly JwtHelper _jwtHelper;

        public AuthController(AuthService authService, JwtHelper jwtHelper)
        {
            _authService = authService;
            _jwtHelper = jwtHelper;
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginDto loginDto)
        {
            var user = await _authService.ValidateUserAsync(loginDto.Email, loginDto.Password);
            if (user == null)
                return Unauthorized(new { message = "Invalid email or password" });

            var token = _jwtHelper.GenerateJwtToken(user);
            return Ok(new LoginResponseDto { 
                Token = token, 
                Email = user.Email, 
                Role = user.Role,
                ProfileImagePath = user.ProfileImagePath 
            });
        }

        [HttpPost("forgot-password")]
        public async Task<IActionResult> ForgotPassword([FromBody] ForgotPasswordDto forgotPasswordDto)
        {
            // POTREBNO IMPLEMENTIRATI FUNKCIONALNOST ZA ZABORAVLJENU LOZINKU
            
            return Ok(new { 
                message = "If an account with this email exists, you will receive a password reset email.",
                note = "Actually, we don't have a password reset feature yet, but we will soon."
            });
        }
    }
} 