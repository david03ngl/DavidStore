namespace DavidStore.Server.Model
{
    public class ProductVariant
    {
        public int Id { get; set; }
        public int ProductId { get; set; }  // Foreign key
        public string Code { get; set; }
        public string Name { get; set; }
        public string ImageLocation { get; set; }
        public int Qty { get; set; }
        public decimal Price { get; set; }
        public bool Active { get; set; }
        public string CreatedUser { get; set; }
        public DateTime CreatedDate { get; set; }
        public string UpdatedUser { get; set; }
        public DateTime UpdatedDate { get; set; }

        // Navigation property for related Product
        public Product Product { get; set; }
    }
}
