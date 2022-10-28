using AutoMapper;
using Loja.Produto.API.DTOs;
using Loja.Produto.API.Models;
using Loja.Produto.API.Repositories.Interfaces;
using Loja.Produto.API.Repositories.Repositories;
using Loja.Produto.API.Services.Interfaces;

namespace Loja.Produto.API.Services.Services;

public class ProductService : IProductService
{
    private readonly IMapper _mapper;
    private IProductRepository _productRepository;

    public ProductService(IMapper mapper, IProductRepository productRepository)
    {
        _mapper = mapper;
        _productRepository = productRepository;
    }

    public async Task<IEnumerable<ProductDTO>> GetProducts()
    {
        var productsEntity = await _productRepository.GetAll();
        return _mapper.Map<IEnumerable<ProductDTO>>(productsEntity);
    }
    public async Task<ProductDTO> GetProductById(int id)
    {
        var productEntity = await _productRepository.GetById(id);
        return _mapper.Map<ProductDTO>(productEntity);
    }
    public async Task AddProduct(ProductDTO productDto)
    {
        var productEntity = _mapper.Map<Product>(productDto);
        await _productRepository.Create(productEntity);
        productDto.ProductId = productEntity.ProductId;
    }
    public async Task UpdateProduct(ProductDTO productDto)
    {
        var categoryEntity = _mapper.Map<Product>(productDto);
        await _productRepository.Update(categoryEntity);
    }
    public async Task RemoveProduct(int id)
    {
        var productEntity = await _productRepository.GetById(id);
        await _productRepository.Delete(productEntity.ProductId);
    }
}

