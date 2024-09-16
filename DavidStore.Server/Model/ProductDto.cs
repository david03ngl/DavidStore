namespace DavidStore.Server.Model
{
    public class ProductDto
    {
        public int Id { get; set; }
        public string Plu { get; set; }
        public string Name { get; set; }
        public int ProductCategoryId { get; set; } // Only the ID
        public bool Active { get; set; }
        public List<ProductVariantsCreateDto> ProductVariants { get; set; }
    }

    public class ProductVariantsCreateDto
    {
        public int Id { get; set; }
        public int ProductId { get; set; }  // Foreign key
        public string Code { get; set; }
        public string Name { get; set; }
        public string ImageLocation { get; set; }
        public int Qty { get; set; }
        public decimal Price { get; set; }
        public bool Active { get; set; }
    }
}
