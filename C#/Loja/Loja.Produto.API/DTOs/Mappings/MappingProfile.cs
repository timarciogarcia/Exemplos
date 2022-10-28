using AutoMapper;
using Loja.Produto.API.Models;

namespace Loja.Produto.API.DTOs.Mappings
{
    public class MappingProfile : Profile
    {
        public MappingProfile()
        {
            CreateMap<Category, CategoryDTO>().ReverseMap();
            CreateMap<Product, ProductDTO>().ReverseMap();  
        } 
    }
}
