using System.ComponentModel.DataAnnotations;

namespace Loja.Produto.API.Models;
public class Category
{
    public int CategoryId { get; set; }
    
    [Required(ErrorMessage = "Campo Obrigatório !!!")]
    [StringLength(100)]
    public string? Name { get; set; }   
    
    public ICollection<Product>? Products { get; set; }
}
