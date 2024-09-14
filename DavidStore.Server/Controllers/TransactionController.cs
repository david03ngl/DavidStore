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
    public async Task<ActionResult<Transactions>> GetTransaction(int id)
    {
        var transaction = await _context.Transactions.Include(t => t.TransactionDetails)
            .FirstOrDefaultAsync(t => t.Id == id);

        if (transaction == null)
        {
            return NotFound();
        }

        return transaction;
    }

    // POST: api/Transactions
    [HttpPost]
    public async Task<ActionResult<Transactions>> PostTransaction(Transactions transaction)
    {
        var transaction2 = new Transactions
        {
            TransactionNo = transaction.TransactionNo,
            TotalAmount = transaction.TotalAmount,
            Active = true,
            CreatedUser = "admin",
            CreatedDate = DateTime.Now,
            UpdatedUser = "admin",
            UpdatedDate = DateTime.Now
        };

        _context.Transactions.Add(transaction);
        await _context.SaveChangesAsync();

        var newTransaction = transaction;

        for(int i = 0;i < transaction.TransactionDetails.Count; i++)
        {
            var newTransactionDetail = new TransactionDetail
            {
                TransactionId = transaction.TransactionDetails[i].TransactionId,
                ProductVariantId = transaction.TransactionDetails[i].ProductVariantId,
                Price = transaction.TransactionDetails[i].Price,
                Qty = transaction.TransactionDetails[i].Qty,
                Subtotal = transaction.TransactionDetails[i].Subtotal,
                Active = true,
                CreatedUser = "admin",
                CreatedDate = DateTime.Now,
                UpdatedUser = "admin",
                UpdatedDate = DateTime.Now
            };

            _context.TransactionDetails.Add(newTransactionDetail);
            await _context.SaveChangesAsync();
        }

        return CreatedAtAction(nameof(GetTransaction), new { id = transaction.Id }, transaction);
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
