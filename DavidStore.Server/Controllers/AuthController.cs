using Microsoft.AspNetCore.Mvc;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using DavidStore.Server.Model;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

[Route("api/[controller]")]
[ApiController]
public class AuthController : ControllerBase
{
    private readonly ApplicationDbContext _context;
    //private readonly IPasswordHasher<UserData> _passwordHasher;

    public AuthController(ApplicationDbContext context)
    {
        _context = context;
        //_passwordHasher = passwordHasher;
    }

    [HttpPost("login")]
    public async Task<ActionResult<IEnumerable<UserData>>> Login([FromBody] AuthDto authDto)
    {
        if (string.IsNullOrEmpty(authDto.Username) || string.IsNullOrEmpty(authDto.Password))
        {
            return BadRequest("Username and Password are required");
        }

        // Find user by username
        var user = await _context.UserDatas.FirstOrDefaultAsync(p => p.Username == authDto.Username);

        if (user == null)
        {
            return NotFound("Username not found");
        }

        // Validate password
        //var passwordVerificationResult = _passwordHasher.VerifyHashedPassword(user, user.Password, authDto.Password);

        //if (passwordVerificationResult == PasswordVerificationResult.Failed)
        //{
        //    return BadRequest("Invalid password");
        //}

        var username = user.Username;
        var role = user.Role;

        var token = GenerateJwtToken(role, username);
        return Ok(new { token });
    }

    private string GenerateJwtToken(string role, string username)
    {
        var claims = new[] {
            new Claim(ClaimTypes.Role, role),
            new Claim(ClaimTypes.Name, username)
        };

        var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes("DavidNGL03DVD031196Nainggolan1996"));
        var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

        var token = new JwtSecurityToken(
            issuer: "http://localhost",
            audience: "http://localhost",
            claims: claims,
            expires: DateTime.Now.AddMinutes(30),
            signingCredentials: creds);

        return new JwtSecurityTokenHandler().WriteToken(token);
    }
}

public class LoginRequest
{
    public string Username { get; set; }
    public string Password { get; set; }
}
