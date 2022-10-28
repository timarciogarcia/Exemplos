using Loja.Produto.API.Models;
using Microsoft.EntityFrameworkCore;

namespace Loja.Produto.API.Context;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
    {
    }

    public DbSet<Category>? Categories { get; set; }
    public DbSet<Product>? Products { get; set; }

    //Fluent Api

    protected override void OnModelCreating(ModelBuilder MB)
    {
        //Category
        MB.Entity<Category>().HasKey(c => c.CategoryId);
        MB.Entity<Category>().Property(c => c.Name).HasMaxLength(100).IsRequired();
        MB.Entity<Category>().HasMany(p => p.Products).WithOne(c => c.Category).IsRequired().OnDelete(DeleteBehavior.NoAction);
        MB.Entity<Category>().HasData(
            new Category
            {
                CategoryId = 1,
                Name = "Material Escolar",
            },
            new Category
            {
                CategoryId = 2,
                Name = "Acessorios",
            }
            );

        //Product
        MB.Entity<Product>().HasKey(c => c.ProductId);
        MB.Entity<Product>().Property(c => c.Name).HasMaxLength(100).IsRequired();
        MB.Entity<Product>().Property(c => c.Description).HasMaxLength(255).IsRequired();
        MB.Entity<Product>().Property(c => c.ImageURL).HasMaxLength(255).IsRequired();
        MB.Entity<Product>().Property(c => c.Price).HasPrecision(12, 2).IsRequired();
    }
}
