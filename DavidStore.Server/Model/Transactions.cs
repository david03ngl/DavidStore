namespace DavidStore.Server.Model
{
    public class Transactions
    {
        public int Id { get; set; }
        public string TransactionNo { get; set; }
        public decimal TotalAmount { get; set; }
        public bool Active { get; set; }
        public string CreatedUser { get; set; }
        public DateTime CreatedDate { get; set; }
        public string UpdatedUser { get; set; }
        public DateTime UpdatedDate { get; set; }

        // Navigation property for related TransactionDetails
        public List<TransactionDetail>? TransactionDetails { get; set; }
    }
}
