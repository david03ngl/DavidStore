namespace DavidStore.Server.Model
{
    public class TransactionCreateDto
    {
        public string TransactionNo { get; set; }
        public decimal TotalAmount { get; set; }
        public bool Active { get; set; }
        public string CreatedUser { get; set; }
        public DateTime CreatedDate { get; set; }
        public string UpdatedUser { get; set; }
        public DateTime UpdatedDate { get; set; }
        public List<TransactionDetailCreateDto> TransactionDetails { get; set; }
    }

    public class TransactionDetailCreateDto
    {
        public int ProductVariantId { get; set; }
        public decimal Price { get; set; }
        public int Qty { get; set; }
        public bool Active { get; set; }
        public string CreatedUser { get; set; }
        public DateTime CreatedDate { get; set; }
        public string UpdatedUser { get; set; }
        public DateTime UpdatedDate { get; set; }
    }
}