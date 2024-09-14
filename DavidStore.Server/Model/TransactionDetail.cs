namespace DavidStore.Server.Model
{
    public class TransactionDetail
    {
        public int Id { get; set; }
        public int TransactionId { get; set; }  // Foreign key
        public int ProductVariantId { get; set; }  // Foreign key
        public decimal Price { get; set; }
        public int Qty { get; set; }
        public decimal Subtotal { get; set; }
        public bool Active { get; set; }
        public string CreatedUser { get; set; }
        public DateTime CreatedDate { get; set; }
        public string UpdatedUser { get; set; }
        public DateTime UpdatedDate { get; set; }

        // Navigation properties for related Transaction and ProductVariant
        public Transactions? Transactions { get; set; }
        public ProductVariant? ProductVariant { get; set; }
    }
}
