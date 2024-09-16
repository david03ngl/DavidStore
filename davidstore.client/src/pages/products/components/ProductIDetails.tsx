import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useGetProductQuery, useUpdateProductMutation } from '../../../redux/products/product.api';
import { useGetProductCategoriessQuery } from '../../../redux/productCategories/productCategory.api';
import Loading from '../../../components/Loading';
import 'swiper/css';
import 'swiper/css/pagination';
import { IProduct, IProductVariant } from '../../../redux/products/product.types';

type ProductParamsId = {
    id: string;
};

const ProductDetails = () => {
    const [products, setProducts] = useState<IProduct>({
        id: 0,
        plu: '',
        name: '',
        productCategoryId: 0,
        active: true,
        createdUser: '',
        createdDate: '',
        updatedUser: '',
        updatedDate: '',
        productCategory: null,
        productVariants: [],
    });

    const [productVariants, setProductVariants] = useState<IProductVariant[]>([
        {
            id: Date.now(), // Use a unique identifier for each new variant
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

    const { id } = useParams() as ProductParamsId;
    const { data: product, isLoading } = useGetProductQuery({ id });
    const { data } = useGetProductCategoriessQuery();
    const [updateProduct, { isLoading: isUpdating }] = useUpdateProductMutation();

    useEffect(() => {
        if (product) {
            setProducts(product);
            setProductVariants(product.productVariants || []);
        }
    }, [product]);

    if (isLoading) return <Loading />;
    if (!product) return <p>Product not found</p>;

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
        setProductVariants(updatedVariants);
    };

    // Add a new product variant
    const addProductVariant = () => {
        const newVariant: IProductVariant = {
            id: Date.now(), // Use a unique identifier for each new variant
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

        try {
            // Call the mutation to update the product in the database
            await updateProduct(products).unwrap();
            console.log('Product updated successfully');
        } catch (error) {
            console.error('Failed to update product:', error);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="product-form">
            <h1 className="form-title">Edit Product</h1>

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
                        value={product.productCategoryId}
                        onChange={handleProductChange}
                        className="form-control"
                    >
                        <option value="" disabled>
                            Select a category
                        </option>
                        {data?.map((category) => (
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

            <button type="submit" className="btn submit-btn" disabled={isUpdating}>
                {isUpdating ? 'Saving...' : 'Save Product'}
            </button>
        </form>
    );
};

export default ProductDetails;
