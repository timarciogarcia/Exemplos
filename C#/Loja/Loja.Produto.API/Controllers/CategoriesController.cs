using Loja.Produto.API.DTOs;
using Loja.Produto.API.Services.Interfaces;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace Loja.Produto.API.Controllers;

[Route("api/[controller]")]
[ApiController]
public class CategoriesController : ControllerBase
{
    private readonly ICategoryService _categoryService;

    public CategoriesController(ICategoryService categoryService)
    {
        _categoryService = categoryService;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<CategoryDTO>>> Get()
    {
        var categoriesDTO = await _categoryService.GetCategories();
        if(categoriesDTO == null)
            return NotFound("Lista de Categorias não existem, Vazio !!!");

        return Ok(categoriesDTO);
    }

    [HttpGet("products")]
    public async Task<ActionResult<IEnumerable<CategoryDTO>>> GetProductsCategories()
    {
        var categoriesDTO = await _categoryService.GetCategoriesProducts();
        if (categoriesDTO == null)
            return NotFound("Lista de Categorias não existem, Vazio !!!");

        return Ok(categoriesDTO);
    }
}
