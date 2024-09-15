using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using DavidStore.Server;
using DavidStore.Server.Model;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace DavidStore.Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ProductCategoriesController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public ProductCategoriesController(ApplicationDbContext context)
        {
            _context = context;
        }

        // GET: api/ProductCategories
        [HttpGet]
        public async Task<ActionResult<IEnumerable<ProductCategory>>> GetProductCategories()
        {
            return Ok(await _context.ProductCategories.ToListAsync());
        }

        // GET: api/ProductCategories/5
        [HttpGet("{id}")]
        public async Task<ActionResult<ProductCategory>> GetProductCategory(int id)
        {
            var productCategory = await _context.ProductCategories.FindAsync(id);

            if (productCategory == null)
            {
                return NotFound();
            }

            return Ok(productCategory);
        }

        // GET: api/Product/page?limit=&skip=
        [HttpGet("page")]
        public async Task<ActionResult<IEnumerable<ProductCategory>>> GetProductCategoriesWithPagination(int limit, int skip)
        {
            var productCategories = await _context.ProductCategories.OrderBy(q => q.Name).Skip(skip).Take(limit).ToListAsync();

            var response = new
            {
                ProductCategories = productCategories
            };

            return Ok(response);
        }

        // POST: api/ProductCategories
        [HttpPost]
        public async Task<ActionResult<ProductCategory>> PostProductCategory(ProductCategory productCategory)
        {
            _context.ProductCategories.Add(productCategory);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetProductCategory), new { id = productCategory.Id }, productCategory);
        }

        // PUT: api/ProductCategories/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutProductCategory(int id, ProductCategory productCategory)
        {
            if (id != productCategory.Id)
            {
                return BadRequest();
            }

            _context.Entry(productCategory).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!ProductCategoryExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return NoContent();
        }

        // DELETE: api/ProductCategories/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteProductCategory(int id)
        {
            var productCategory = await _context.ProductCategories.FindAsync(id);
            if (productCategory == null)
            {
                return NotFound();
            }

            _context.ProductCategories.Remove(productCategory);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool ProductCategoryExists(int id)
        {
            return _context.ProductCategories.Any(e => e.Id == id);
        }
    }
}
