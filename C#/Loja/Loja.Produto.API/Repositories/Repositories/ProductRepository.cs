﻿using Loja.Produto.API.Context;
using Loja.Produto.API.Models;
using Loja.Produto.API.Repositories.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace Loja.Produto.API.Repositories.Repositories;

public class ProductRepository : IProductRepository
{
    private readonly AppDbContext _context;

    public ProductRepository(AppDbContext context)
    {
        _context = context;
    }

    public async Task<IEnumerable<Product>> GetAll()
    {
        return await _context.Products.Include(c => c.Category).ToListAsync();
    }

    public async Task<Product> GetById(int id)
    {
        return await _context.Products.Include(c => c.Category).Where(p => p.ProductId == id)
            .FirstOrDefaultAsync();
    }

    public async Task<Product> Create(Product product)
    {
        _context.Products.Add(product);
        await _context.SaveChangesAsync();
        return product;
    }

    public async Task<Product> Update(Product product)
    {
        _context.Entry(product).State = EntityState.Modified;
        await _context.SaveChangesAsync();
        return product;
    }

    public async Task<Product> Delete(int id)
    {
        var product = await GetById(id);
        _context.Products.Remove(product);
        await _context.SaveChangesAsync();
        return product;
    }
}
