using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Loja.Produto.API.Models;
public class Product
{
    public int ProductId { get; set; }

    [Required(ErrorMessage = "Campo Obrigatório !!!")]
    [MinLength(5)]
    [MaxLength(100)]
    public string? Name { get; set; }

    [Required(ErrorMessage = "Campo Obrigatório !!!")]
    public decimal Price { get; set; }

    [Required(ErrorMessage = "Campo Obrigatório !!!")]
    [MinLength(5)]
    [MaxLength(255)]
    public string? Description { get; set; }

    [Required(ErrorMessage = "Campo Obrigatório !!!")]
    [Range(1, 9999)]
    public long Stock { get; set; }

    [Required(ErrorMessage = "Campo Obrigatório !!!")]
    [MinLength(5)]
    [MaxLength(255)]
    public string? ImageURL { get; set; }

    public Category? Category { get; set; }
    public int CategoryId { get; set; }
}
