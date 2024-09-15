using DavidStore.Server.Model;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

[Route("api/[controller]")]
[ApiController]
public class TransactionsController : ControllerBase
{
    private readonly ApplicationDbContext _context;

    public TransactionsController(ApplicationDbContext context)
    {
        _context = context;
    }

    // GET: api/Transactions
    [HttpGet]
    public async Task<ActionResult<IEnumerable<Transactions>>> GetTransactions()
    {
        return await _context.Transactions.Include(t => t.TransactionDetails).ToListAsync();
    }

    // GET: api/Transactions/5
    [HttpGet("{id}")]
    public async Task<ActionResult<Transactions>> GetTransactionById(int id)
    {
        var transaction = await _context.Transactions.Include(t => t.TransactionDetails).ThenInclude(td => td.ProductVariant)
            .FirstOrDefaultAsync(t => t.Id == id);

        if (transaction == null)
        {
            return NotFound();
        }

        return Ok(transaction);
    }

    // POST: api/Transactions
    [HttpPost]
    public async Task<IActionResult> PostTransaction([FromBody] TransactionCreateDto transactionDto)
    {
        if(!ModelState.IsValid)
        {
            return BadRequest();
        }

        var transaction = new Transactions
        {
            TransactionNo = transactionDto.TransactionNo,
            TotalAmount = transactionDto.TotalAmount,
            Active = true,
            CreatedUser = transactionDto.CreatedUser,
            CreatedDate = DateTime.Now < new DateTime(1753, 1, 1) ? 
                                            new DateTime(1753, 1, 1) : DateTime.Now,
            UpdatedUser = transactionDto.UpdatedUser,
            UpdatedDate = DateTime.Now < new DateTime(1753, 1, 1) ? 
                                            new DateTime(1753, 1, 1) : DateTime.Now,
            TransactionDetails = transactionDto.TransactionDetails.Select(detail => new TransactionDetail
            {
                ProductVariantId = detail.ProductVariantId,
                Price = detail.Price,
                Qty = detail.Qty,
                Active = true,
                CreatedUser = detail.CreatedUser,
                CreatedDate = DateTime.Now < new DateTime(1753, 1, 1) ? 
                                                new DateTime(1753, 1, 1) : DateTime.Now,
                UpdatedUser = detail.UpdatedUser,
                UpdatedDate = DateTime.Now < new DateTime(1753, 1, 1) ? 
                                                new DateTime(1753, 1, 1) : DateTime.Now
            }).ToList()
        };

        _context.Transactions.Add(transaction);
        await _context.SaveChangesAsync();

        return CreatedAtAction(nameof(GetTransactionById), new { id = transaction.Id }, transaction);
    }

    // PUT: api/Transactions/5
    [HttpPut("{id}")]
    public async Task<IActionResult> PutTransaction(int id, Transactions transaction)
    {
        if (id != transaction.Id)
        {
            return BadRequest();
        }

        _context.Entry(transaction).State = EntityState.Modified;

        try
        {
            await _context.SaveChangesAsync();
        }
        catch (DbUpdateConcurrencyException)
        {
            if (!TransactionExists(id))
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

    // DELETE: api/Transactions/5
    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteTransaction(int id)
    {
        var transaction = await _context.Transactions.FindAsync(id);
        if (transaction == null)
        {
            return NotFound();
        }

        _context.Transactions.Remove(transaction);
        await _context.SaveChangesAsync();

        return NoContent();
    }

    private bool TransactionExists(int id)
    {
        return _context.Transactions.Any(e => e.Id == id);
    }
}
