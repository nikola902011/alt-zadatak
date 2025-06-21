using Api.Models;
using Api.Helpers;
using Microsoft.EntityFrameworkCore;

namespace Api.Data
{
    public static class DbInitializer
    {
        public static void Initialize(AppDbContext context, bool forceSeed = false)
        {
            // Ensure database is created
            context.Database.EnsureCreated();

            // Check if users already exist (unless force seed is enabled)
            if (!forceSeed && context.Users.Any())
            {
                Console.WriteLine("Users already exist in database. Skipping seed data.");
                return; // Database has been seeded
            }

            // Clear existing users if force seed is enabled
            if (forceSeed && context.Users.Any())
            {
                Console.WriteLine("Clearing existing users for force seed...");
                context.Users.RemoveRange(context.Users);
                context.SaveChanges();
            }

            Console.WriteLine("Adding seed users to database...");

            // Add test users with hashed passwords
            var users = new User[]
            {
                new User
                {
                    Username = "admin",
                    Email = "admin@example.com",
                    PasswordHash = PasswordHelper.HashPassword("password"),
                    Role = "Admin",
                    FirstName = "Admin",
                    LastName = "User",
                    CreatedAt = DateTime.UtcNow,
                    ProfileImagePath = ""
                },
                new User
                {
                    Username = "user",
                    Email = "user@example.com",
                    PasswordHash = PasswordHelper.HashPassword("password"),
                    Role = "Customer",
                    FirstName = "John",
                    LastName = "Doe",
                    CreatedAt = DateTime.UtcNow,
                    ProfileImagePath = ""
                }
            };

            context.Users.AddRange(users);
            context.SaveChanges();
            
            Console.WriteLine($"Successfully added {users.Length} users to database.");
        }
    }
} 