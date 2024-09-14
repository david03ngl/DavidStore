namespace DavidStore.Server.Model
{
    public class ProductCategory
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public bool Active { get; set; }
        public string CreatedUser { get; set; }
        public DateTime CreatedDate { get; set; }
        public string UpdatedUser { get; set; }
        public DateTime UpdatedDate { get; set; }
    }
}
