using Api.Models;
using Api.Helpers;
using Microsoft.EntityFrameworkCore;

namespace Api.Data
{
    public static class DbInitializer
    {
        public static void Initialize(AppDbContext context, bool forceSeed = false)
        {
            context.Database.EnsureCreated();

            if (!forceSeed && context.Users.Any())
            {
                Console.WriteLine("Users already exist in database. Skipping seed data.");
                return; 
            }

            if (forceSeed && context.Users.Any())
            {
                Console.WriteLine("Clearing existing users for force seed...");
                context.Users.RemoveRange(context.Users);
                context.SaveChanges();
            }

            Console.WriteLine("Adding seed users to database...");


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
                    ProfileImagePath = "/images/users/user1.jpg",
                    ContactNumber = "+38160111222"
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
                    ProfileImagePath = "/images/users/user1.jpg",
                    ContactNumber = "+38160111333"
                },
                new User
                {
                    Username = "customer",
                    Email = "user2@example.com",
                    PasswordHash = PasswordHelper.HashPassword("password"),
                    Role = "Customer",
                    FirstName = "Mark",
                    LastName = "Jackson",
                    CreatedAt = DateTime.UtcNow,
                    ProfileImagePath = "/images/users/user1.jpg",
                    ContactNumber = "+38160111444"
                },
                new User
                {
                    Username = "Bobby11",
                    Email = "user3@example.com",
                    PasswordHash = PasswordHelper.HashPassword("password"),
                    Role = "Customer",
                    FirstName = "Bobby",
                    LastName = "Brown",
                    CreatedAt = DateTime.UtcNow,
                    ProfileImagePath = "/images/users/user2.jpg",
                    ContactNumber = "+38160111555"
                },
                new User
                {
                    Username = "Seb83",
                    Email = "user4@example.com",
                    PasswordHash = PasswordHelper.HashPassword("password"),
                    Role = "Customer",
                    FirstName = "Sebastian",
                    LastName = "Turlich",
                    CreatedAt = DateTime.UtcNow,
                    ProfileImagePath = "/images/users/user1.jpg",
                    ContactNumber = "+38160111666"
                },
            };

            context.Users.AddRange(users);
            context.SaveChanges();
            
            Console.WriteLine($"Successfully added {users.Length} users to database.");


            if (forceSeed && context.Products.Any())
            {
                Console.WriteLine("Clearing existing products for force seed...");
                context.Products.RemoveRange(context.Products);
                context.SaveChanges();
            }

            if (!context.Products.Any())
            {
                Console.WriteLine("Adding seed products to database...");
                var products = new Product[]
                {
                    new Product { Name = "iPad Pro", Price = 799.00m, Category = "Tablets", ImagePath = "/images/products/iPadPro.png" },
                    new Product { Name = "AirPods Pro", Price = 249.00m, Category = "Wearables", ImagePath = "/images/products/AirPods.jpg" },
                    new Product { Name = "Playstation 5", Price = 499.00m, Category = "Gaming", ImagePath = "/images/products/Playstation.png" },
                    new Product { Name = "Apple Watch", Price = 249.00m, Category = "Wearables", ImagePath = "/images/products/watch.png" },
                    new Product { Name = "iPhone 15 Pro", Price = 999.00m, Category = "Smartphones", ImagePath = "/images/products/Iphone.png" },
                    new Product { Name = "Canon EOS R5", Price = 3899.00m, Category = "Electronics", ImagePath = "/images/products/Cannon.jpg" },
                    new Product { Name = "MacBook Pro", Price = 1299.00m, Category = "Laptops", ImagePath = "/images/products/MacBook.jpg" },
                };

                context.Products.AddRange(products);
                context.SaveChanges();
                Console.WriteLine($"Successfully added {products.Length} products to database.");
            }
        }
    }
} 