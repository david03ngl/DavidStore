using DavidStore.Server.Model;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System;

[Route("api/[controller]")]
[ApiController]
public class ProductController : ControllerBase
{
    private readonly ApplicationDbContext _context;

    public ProductController(ApplicationDbContext context)
    {
        _context = context;
    }

    // GET: api/Product
    [HttpGet]
    public async Task<ActionResult<IEnumerable<Product>>> GetProducts()
    {
        return Ok(await _context.Products.Include(p => p.ProductCategory).ToListAsync());
    }

    // GET: api/Product/page?limit=&skip=
    [HttpGet("page")]
    public async Task<ActionResult<IEnumerable<Product>>> GetProductsWithPagination(int limit, int skip)
    {
        var products = await _context.Products.Include(p => p.ProductCategory).OrderBy(q => q.Name).Skip(skip).Take(limit).Include(p => p.ProductVariants).ToListAsync();

        var response = new
        {
            Products = products
        };

        return Ok(response);
    }

    // GET: api/Product/5
    [HttpGet("{id}")]
    public async Task<ActionResult<Product>> GetProduct(int id)
    {
        var product = await _context.Products.Include(p => p.ProductVariants).FirstOrDefaultAsync(p => p.Id == id);

        if (product == null)
        {
            return NotFound();
        }

        return Ok(product);
    }

    // POST: api/Product
    [HttpPost]
    public async Task<ActionResult<Product>> PostProduct([FromBody] ProductDto dto)
    {
        var newProduct = new Product
        {
            Plu = dto.Plu,
            Name = dto.Name,
            ProductCategoryId = dto.ProductCategoryId,
            Active = dto.Active,
            CreatedUser = "admin",
            CreatedDate = DateTime.Now,
            UpdatedUser = "admin",
            UpdatedDate = DateTime.Now
    };

        _context.Products.Add(newProduct);

        await _context.SaveChangesAsync();

        // Get the saved ProductId
        var savedProductId = newProduct.Id;

        var newProductVariants = dto.ProductVariants.Select(variant => new ProductVariant
        {
            Code = variant.Code,
            Name = variant.Name,
            ImageLocation = variant.ImageLocation,
            Qty = variant.Qty,
            Price = variant.Price,
            Active = variant.Active,
            ProductId = savedProductId,  // Assign the ProductId to each variant
            CreatedUser = "admin",
            CreatedDate = DateTime.Now,
            UpdatedUser = "admin",
            UpdatedDate = DateTime.Now
        }).ToList();

        _context.ProductVariants.AddRange(newProductVariants);

        await _context.SaveChangesAsync();

        return CreatedAtAction(nameof(GetProduct), new { id = newProduct.Id }, newProduct);
    }

    // PUT: api/Product/5
    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateProduct(int id, [FromBody] ProductDto productDto)
    {
        if (id != productDto.Id)
        {
            return BadRequest("Product ID mismatch");
        }

        var product = await _context.Products
            .Include(p => p.ProductVariants)
            .FirstOrDefaultAsync(p => p.Id == productDto.Id);

        if (product == null)
        {
            return NotFound();
        }

        // Update product properties
        product.Plu = productDto.Plu;
        product.Name = productDto.Name;
        product.ProductCategoryId = productDto.ProductCategoryId;
        product.Active = productDto.Active;
        product.UpdatedUser = "admin";
        product.UpdatedDate = DateTime.Now;

        // Update or add product variants
        foreach (var variantDto in productDto.ProductVariants)
        {
            var existingVariant = product.ProductVariants
                .FirstOrDefault(v => v.Id == variantDto.Id);

            if (existingVariant != null)
            {
                // Existing variant, update its properties
                existingVariant.Name = variantDto.Name;
                existingVariant.Code = variantDto.Code;
                existingVariant.Price = variantDto.Price;
                existingVariant.Qty = variantDto.Qty;
                existingVariant.ImageLocation = variantDto.ImageLocation;
                existingVariant.UpdatedDate = DateTime.Now;

                _context.Entry(existingVariant).State = EntityState.Modified;
            }
            else
            {
                // New variant, add it to the database
                var newVariant = new ProductVariant
                {
                    ProductId = productDto.Id,
                    Code = variantDto.Code,
                    Name = variantDto.Name,
                    ImageLocation = variantDto.ImageLocation,
                    Price = variantDto.Price,
                    Qty = variantDto.Qty,
                    Active = true,
                    CreatedUser = "admin",
                    CreatedDate = DateTime.Now,
                    UpdatedUser = "admin",
                    UpdatedDate = DateTime.Now
                };

                product.ProductVariants.Add(newVariant);
            }
        }

        // Save changes
        await _context.SaveChangesAsync();

        return NoContent();
    }


    // DELETE: api/Product/5
    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteProduct(int id)
    {
        var product = await _context.Products.FindAsync(id);
        if (product == null)
        {
            return NotFound();
        }

        _context.Products.Remove(product);
        await _context.SaveChangesAsync();

        return NoContent();
    }
}
