namespace DavidStore.Server.Model
{
    public class Product
    {
        public int Id { get; set; }
        public string Plu { get; set; }
        public string Name { get; set; }
        public int ProductCategoryId { get; set; }  // Foreign key
        public bool Active { get; set; }
        public string CreatedUser { get; set; }
        public DateTime CreatedDate { get; set; }
        public string UpdatedUser { get; set; }
        public DateTime UpdatedDate { get; set; }

        // Navigation property for related ProductCategory
        public ProductCategory ProductCategory { get; set; }

        // Navigation property for related ProductVariants
        public List<ProductVariant> ProductVariants { get; set; }
    }
}
