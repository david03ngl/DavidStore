import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCreateProductMutation } from '../../../redux/products/product.api';
import { useGetProductCategoriessQuery } from '../../../redux/productCategories/productCategory.api';
import Loading from '../../../components/Loading';
import 'swiper/css';
import 'swiper/css/pagination';
import { IProduct, IProductVariant } from '../../../redux/products/product.types';

const AddProduct = () => {
    const [products, setProducts] = useState<IProduct>({
        id: 0, // No ID for new product
        plu: '',
        name: '',
        productCategoryId: 0,
        active: true,
        createdUser: '',
        createdDate: '',
        updatedUser: '',
        updatedDate: '',
        productCategory: null,
        productVariants: [], // Empty variants for new product
    });

    const [productVariants, setProductVariants] = useState<IProductVariant[]>([
        {
            id: Date.now(), // Unique identifier for each new variant
            code: '',
            name: '',
            imageLocation: '',
            qty: 0,
            price: 0,
            active: true,
            createdUser: '',
            createdDate: '',
            updatedUser: '',
            updatedDate: '',
        },
    ]);

    const navigate = useNavigate();
    const { data: categories, isLoading: isLoadingCategories } = useGetProductCategoriessQuery();
    const [createProduct, { isLoading: isCreating }] = useCreateProductMutation();

    // Handle product input changes
    const handleProductChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;

        // Handle category selection
        if (name === "productCategoryId") {
            setProducts({
                ...products,
                productCategoryId: parseInt(value), // Convert the value to a number since it's an ID
            });
        } else {
            setProducts({
                ...products,
                [name]: value,
            });
        }
    };

    // Handle product variant input changes
    const handleProductVariantChange = (index: number, e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        const updatedVariants = [...productVariants];
        updatedVariants[index] = {
            ...updatedVariants[index],
            [name]: value,
        };

        setProducts((prevProducts) => ({
            ...prevProducts, // Spread previous product properties
            productVariants: updatedVariants, // Replace productVariants with the updated ones
        }));

        setProductVariants(updatedVariants);
    };

    // Add a new product variant
    const addProductVariant = () => {
        const newVariant: IProductVariant = {
            id: Date.now(), // Unique identifier for new variant
            code: '',
            name: '',
            imageLocation: '',
            qty: 0,
            price: 0,
            active: true,
            createdUser: '',
            createdDate: '',
            updatedUser: '',
            updatedDate: '',
        };
        // Make a copy of productVariants and add the new variant
        setProducts((prevProducts) => ({
            ...prevProducts,
            productVariants: [...prevProducts.productVariants, newVariant], // Spread existing variants and add the new one
        }));

        setProductVariants([...productVariants, newVariant]);
    };

    // Handle form submission
    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const newVariants = productVariants.map(variant => ({
            code: variant.code,
            name: variant.name,
            imageLocation: variant.imageLocation,
            qty: variant.qty,
            price: variant.price,
            active: variant.active,
        }));

        const newProduct = {
            plu: products.plu,
            name: products.name,
            productCategoryId: products.productCategoryId,
            active: products.active,
            productVariants: newVariants,
        };

        try {
            // Call the mutation to create the product in the database
            await createProduct(newProduct).unwrap();
            console.log('Product created successfully');
            navigate('/products/');
            window.location.reload();
        } catch (error) {
            console.error('Failed to create product:', error);
        }
    };

    if (isLoadingCategories) return <Loading />;

    return (
        <form onSubmit={handleSubmit} className="product-form">
            <h1 className="form-title">Add Product</h1>

            <div className="product-section">
                <div className="form-group">
                    <label htmlFor="plu">PLU:</label>
                    <input
                        type="text"
                        name="plu"
                        id="plu"
                        value={products.plu}
                        onChange={handleProductChange}
                        required
                        className="form-control"
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="name">Name:</label>
                    <input
                        type="text"
                        name="name"
                        id="name"
                        value={products.name}
                        onChange={handleProductChange}
                        required
                        className="form-control"
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="category-select">Product Category:</label>
                    <select
                        id="category-select"
                        name="productCategoryId"
                        value={products.productCategoryId}
                        onChange={handleProductChange}
                        className="form-control"
                    >
                        <option value={0}>
                            Select a category
                        </option>
                        {categories?.map((category: any) => (
                            <option key={category.id} value={category.id}>
                                {category.name}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="form-group">
                    <label htmlFor="active">Active:</label>
                    <select
                        name="active"
                        id="active"
                        value={String(products.active)}
                        onChange={handleProductChange}
                        className="form-control"
                    >
                        <option value="true">Yes</option>
                        <option value="false">No</option>
                    </select>
                </div>
            </div>

            <h2 className="variant-title">Product Variants</h2>
            {productVariants.map((variant, index) => (
                <div key={variant.id} className="variant-section">
                    <div className="form-group">
                        <label htmlFor={`code-${index}`}>Code:</label>
                        <input
                            type="text"
                            name="code"
                            id={`code-${index}`}
                            value={variant.code}
                            onChange={(e) => handleProductVariantChange(index, e)}
                            required
                            className="form-control"
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor={`variant-name-${index}`}>Name:</label>
                        <input
                            type="text"
                            name="name"
                            id={`variant-name-${index}`}
                            value={variant.name}
                            onChange={(e) => handleProductVariantChange(index, e)}
                            required
                            className="form-control"
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor={`image_location-${index}`}>Image Location:</label>
                        <input
                            type="text"
                            name="imageLocation"
                            id={`image_location-${index}`}
                            value={variant.imageLocation}
                            onChange={(e) => handleProductVariantChange(index, e)}
                            className="form-control"
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor={`qty-${index}`}>Quantity:</label>
                        <input
                            type="number"
                            name="qty"
                            id={`qty-${index}`}
                            value={variant.qty}
                            onChange={(e) => handleProductVariantChange(index, e)}
                            required
                            className="form-control"
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor={`price-${index}`}>Price:</label>
                        <input
                            type="number"
                            name="price"
                            id={`price-${index}`}
                            value={variant.price}
                            onChange={(e) => handleProductVariantChange(index, e)}
                            required
                            className="form-control"
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor={`active-variant-${index}`}>Active:</label>
                        <select
                            name="active"
                            id={`active-variant-${index}`}
                            value={String(variant.active)}
                            onChange={(e) => handleProductVariantChange(index, e)}
                            className="form-control"
                        >
                            <option value="true">Yes</option>
                            <option value="false">No</option>
                        </select>
                    </div>
                </div>
            ))}

            <button type="button" className="btn add-variant-btn" onClick={addProductVariant}>
                Add Variant
            </button>

            <button type="submit" className="btn submit-btn" disabled={isCreating}>
                {isCreating ? 'Creating...' : 'Add Product'}
            </button>
        </form>
    );
};

export default AddProduct;
