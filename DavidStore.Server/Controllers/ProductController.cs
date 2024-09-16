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
    public async Task<ActionResult<Product>> PostProduct(Product product)
    {
        _context.Products.Add(product);
        await _context.SaveChangesAsync();

        return CreatedAtAction(nameof(GetProduct), new { id = product.Id }, product);
    }

    // PUT: api/Product/5
    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateProduct(int id, [FromBody] ProductDto productDto)
    {
        if (productDto == null)
        {
            return BadRequest("ProductDto is required.");
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
        product.ProductCategoryId = productDto.ProductCategoryId; // Set only the ID
        product.Active = productDto.Active;
        product.CreatedUser = "admin";
        product.CreatedDate = DateTime.Now;
        product.UpdatedUser = "admin";
        product.UpdatedDate = DateTime.Now;

        // Track existing variant IDs
        var existingVariantIds = product.ProductVariants.Select(v => v.Id).ToHashSet();

        foreach (var variantDto in productDto.ProductVariants)
        {
            // Check if the variant already exists
            var existingVariant = product.ProductVariants.FirstOrDefault(v => v.Id == variantDto.Id);

            if (existingVariant != null)
            {
                // Update existing variant
                existingVariant.Code = variantDto.Code;
                existingVariant.Name = variantDto.Name;
                existingVariant.Price = variantDto.Price;
                existingVariant.Qty = variantDto.Qty;
                existingVariant.ImageLocation = variantDto.ImageLocation;
                existingVariant.UpdatedDate = DateTime.Now;

                _context.Entry(existingVariant).State = EntityState.Modified;
            }
            else
            {
                // Add new variant
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
                    UpdatedDate = DateTime.Now,
                    Product = product
                };

                _context.ProductVariants.Add(newVariant);
            }
        }

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
