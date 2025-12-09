using Microsoft.EntityFrameworkCore;
using Microsoft.OpenApi.Models;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using LibraryAPI.Data;
using LibraryAPI.Services;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();

// Configure JWT Authentication
var jwtSecret = builder.Configuration["Jwt:Secret"] ?? "your-super-secret-key-at-least-32-characters-long";
var key = Encoding.ASCII.GetBytes(jwtSecret);

builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultScheme = JwtBearerDefaults.AuthenticationScheme;
})
.AddJwtBearer(options =>
{
    options.RequireHttpsMetadata = false; // Set to true in production
    options.SaveToken = true;
    options.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuerSigningKey = true,
        IssuerSigningKey = new SymmetricSecurityKey(key),
        ValidateIssuer = false,
        ValidateAudience = false,
        ValidateLifetime = true,
        ClockSkew = TimeSpan.Zero
    };
});

builder.Services.AddAuthorization();

// Configure Swagger
builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new OpenApiInfo
    {
        Title = "Library Management System API",
        Version = "v1",
        Description = "API for managing library books",
        Contact = new OpenApiContact
        {
            Name = "Library Admin",
            Email = "admin@library.com"
        }
    });

    // Add JWT Authentication to Swagger
    c.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
    {
        Description = "JWT Authorization header using the Bearer scheme. Example: \"Bearer {token}\"",
        Name = "Authorization",
        In = ParameterLocation.Header,
        Type = SecuritySchemeType.Http,
        Scheme = "bearer",
        BearerFormat = "JWT"
    });

    c.AddSecurityRequirement(new OpenApiSecurityRequirement
    {
        {
            new OpenApiSecurityScheme
            {
                Reference = new OpenApiReference
                {
                    Type = ReferenceType.SecurityScheme,
                    Id = "Bearer"
                }
            },
            new string[] {}
        }
    });
});

// Configure CORS
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowReactApp",
        policy =>
        {
            policy.WithOrigins(
                    "http://localhost:3000", 
                    "https://localhost:3000",
                    "http://localhost:3001",
                    "http://192.168.8.187:3000"
                  )
                  .AllowAnyHeader()
                  .AllowAnyMethod()
                  .AllowCredentials();
        });
});

// Configure SQLite Database
builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseSqlite(builder.Configuration.GetConnectionString("DefaultConnection")));

// Register Services
builder.Services.AddScoped<IBookService, BookService>();
builder.Services.AddScoped<IAuthService, AuthService>();

var app = builder.Build();

// Configure the HTTP request pipeline
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI(c =>
    {
        c.SwaggerEndpoint("/swagger/v1/swagger.json", "Library API v1");
        c.RoutePrefix = "swagger";
        c.DisplayRequestDuration();
        c.EnableDeepLinking();
    });
}

// Comment out HTTPS redirection for development
// app.UseHttpsRedirection();

app.UseCors("AllowReactApp");

app.UseAuthentication(); // IMPORTANT: Must be before UseAuthorization
app.UseAuthorization();

app.MapControllers();

// Initialize Database
using (var scope = app.Services.CreateScope())
{
    var dbContext = scope.ServiceProvider.GetRequiredService<ApplicationDbContext>();
    dbContext.Database.EnsureCreated();
    
    // Seed some initial data
    await SeedData.InitializeAsync(dbContext);
}

app.Run();

// Seed Data Class
public static class SeedData
{
    public static async Task InitializeAsync(ApplicationDbContext context)
    {
        // Seed books if none exist
        if (!context.Books.Any())
        {
            var books = new[]
            {
                new LibraryAPI.Models.Book
                {
                    Title = "The Great Gatsby",
                    Author = "F. Scott Fitzgerald",
                    Description = "A classic novel of the Jazz Age",
                    ISBN = "9780743273565",
                    PublicationYear = 1925,
                    CreatedAt = DateTime.UtcNow
                },
                new LibraryAPI.Models.Book
                {
                    Title = "To Kill a Mockingbird",
                    Author = "Harper Lee",
                    Description = "A novel about racial injustice in the American South",
                    ISBN = "9780061120084",
                    PublicationYear = 1960,
                    CreatedAt = DateTime.UtcNow.AddHours(-1)
                },
                new LibraryAPI.Models.Book
                {
                    Title = "1984",
                    Author = "George Orwell",
                    Description = "A dystopian social science fiction novel",
                    ISBN = "9780451524935",
                    PublicationYear = 1949,
                    CreatedAt = DateTime.UtcNow.AddHours(-2)
                },
                new LibraryAPI.Models.Book
                {
                    Title = "Pride and Prejudice",
                    Author = "Jane Austen",
                    Description = "A romantic novel of manners",
                    ISBN = "9780141439518",
                    PublicationYear = 1813,
                    CreatedAt = DateTime.UtcNow.AddHours(-3)
                },
                new LibraryAPI.Models.Book
                {
                    Title = "The Catcher in the Rye",
                    Author = "J.D. Salinger",
                    Description = "A story about teenage rebellion and alienation",
                    ISBN = "9780316769488",
                    PublicationYear = 1951,
                    CreatedAt = DateTime.UtcNow.AddHours(-4)
                }
            };
            
            await context.Books.AddRangeAsync(books);
            await context.SaveChangesAsync();
        }
        
        // Create a default admin user if none exist
        if (!context.Users.Any())
        {
            var adminUser = new LibraryAPI.Models.User
            {
                Email = "admin@library.com",
                PasswordHash = BCrypt.Net.BCrypt.HashPassword("password123"),
                FullName = "Administrator",
                CreatedAt = DateTime.UtcNow,
                IsActive = true
            };
            
            await context.Users.AddAsync(adminUser);
            await context.SaveChangesAsync();
        }
    }
}