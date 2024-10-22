import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useGetProductQuery, useUpdateProductMutation } from '../../../redux/products/product.api';
import { useGetProductCategoriessQuery } from '../../../redux/productCategories/productCategory.api';
import Loading from '../../../components/Loading';
import 'swiper/css';
import 'swiper/css/pagination';
import { IProduct, IProductVariant } from '../../../redux/products/product.types';
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { storage } from '../../../firebase';

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
            id: 0,
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

    const [imagePreviews, setImagePreviews] = useState<string[]>([]); // State for image previews

    const navigate = useNavigate();
    const { id } = useParams() as ProductParamsId;
    const { data: product, isLoading } = useGetProductQuery({ id });
    const { data } = useGetProductCategoriessQuery();
    const [updateProduct, { isLoading: isUpdating }] = useUpdateProductMutation();

    useEffect(() => {
        if (product) {
            setProducts(product);
            setProductVariants(product.productVariants || []);
            // Set initial image previews based on existing product variants
            const previews = product.productVariants.map(variant => variant.imageLocation ? variant.imageLocation : '');
            setImagePreviews(previews); // Initialize image previews
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

        setProducts((prevProducts) => ({
            ...prevProducts, // Spread previous product properties
            productVariants: updatedVariants, // Replace ProductVariants with the updated ones
        }));

        setProductVariants(updatedVariants);
    };

    // Add a new product variant
    const addProductVariant = () => {
        const newVariant: IProductVariant = {
            id: 0,
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
        setProducts((prevProducts) => ({
            ...prevProducts,
            productVariants: [...prevProducts.productVariants, newVariant], // Spread existing variants and add the new one
        }));

        setProductVariants([...productVariants, newVariant]);
        setImagePreviews([...imagePreviews, '']); // Initialize the preview for the new variant
    };

    // Remove a product variant with confirmation
    const removeProductVariant = (index: number) => {
        if (window.confirm("Are you sure you want to delete this variant?")) {
            const updatedVariants = productVariants.filter((_, i) => i !== index);
            const updatedPreviews = imagePreviews.filter((_, i) => i !== index); // Update image previews

            setProducts((prevProducts) => ({
                ...prevProducts,
                productVariants: updatedVariants,
            }));

            setProductVariants(updatedVariants);
            setImagePreviews(updatedPreviews); // Update previews state
        }
    };

    // Handle file input change
    const handleFileChange = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const imageLocation = file.name; // Just for demonstration; implement upload logic here
            const updatedVariants = [...productVariants];
            updatedVariants[index] = {
                ...updatedVariants[index],
                imageLocation,
            };

            setProducts((prevProducts) => ({
                ...prevProducts,
                productVariants: updatedVariants,
            }));

            setProductVariants(updatedVariants);

            // Create a URL for the preview
            const reader = new FileReader();
            reader.onloadend = () => {
                const updatedPreviews = [...imagePreviews];
                updatedPreviews[index] = reader.result as string; // Set the preview image
                setImagePreviews(updatedPreviews);
            };
            reader.readAsDataURL(file);
        }
    };

    // Handle form submission
    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const MAX_FILE_SIZE = 1024 * 1024;
        const newVariants = [];

        for (let i = 0; i < productVariants.length; i++) {
            const fileInput = document.getElementById(`image_location-${i}`) as HTMLInputElement;
            const file = fileInput.files?.[0];

            let downloadURL = "";

            if (file) {
                // Check if the file size exceeds the limit
                if (file.size > MAX_FILE_SIZE) {
                    alert(`File size exceeds the limit of ${MAX_FILE_SIZE / (1024 * 1024)} MB.`);
                    return; // Exit the function if the file is too large
                }

                // Check if there is an existing image URL to delete
                const previousImageURL = product.productVariants[i];

                if (previousImageURL && previousImageURL.imageLocation !== "") {
                    // Extract the file path from the previous URL (Firebase Storage URL format)
                    const previousImageRef = ref(storage, previousImageURL.imageLocation);

                    // Delete the previous image
                    deleteObject(previousImageRef)
                        .then(() => {
                            console.log('Previous image deleted successfully');
                        })
                        .catch((error) => {
                            console.error('Error deleting previous image:', error);
                        });
                }

                const storageRef = ref(storage, `images/${file.name}`);

                try {
                    // Upload the file to Firebase Storage
                    await uploadBytes(storageRef, file);
                    // Get the download URL
                    downloadURL = await getDownloadURL(storageRef);
                } catch (error) {
                    console.error('Error uploading image to Firebase:', error);
                }
            }
            else {
                downloadURL = product.productVariants[i].imageLocation;
            }

            newVariants.push({
                "id": productVariants[i].id,
                "code": productVariants[i].code,
                "name": productVariants[i].name,
                "imageLocation": downloadURL,
                "qty": productVariants[i].qty,
                "price": productVariants[i].price,
                "active": productVariants[i].active
            });
        }

        const newProduct = {
            "id": products.id,
            "plu": products.plu,
            "name": products.name,
            "productCategoryId": products.productCategoryId,
            "active": products.active,
            "productVariants": newVariants
        }

        try {
            await updateProduct(newProduct).unwrap();
            console.log('Product updated successfully');
            navigate('/products/');
            window.location.reload();
        } catch (error) {
            console.error('Failed to update product:', error);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="product-form">
            <h1 className="form-title">Edit Product</h1>

            {/* Product Info */}
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
                        <option value="" disabled>Select a category</option>
                        {data?.map((category: any) => (
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

            {/* Product Variants */}
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
                        <div style={{ display: 'flex', alignItems: 'center' }}>
                            <input
                                type="file"
                                name="imageLocation"
                                id={`image_location-${index}`}
                                accept="image/*"
                                onChange={(e) => handleFileChange(index, e)}
                                className="form-control"
                                style={{ marginRight: '15px' }} // Increased spacing for better visual separation
                            />

                            {imagePreviews[index] && (
                                <div className="prevImage">
                                    <img
                                        className="imgPrev"
                                        src={imagePreviews[index]}
                                        alt={`Preview ${index}`}
                                    />
                                </div>
                            )}
                        </div>
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

                    {/* Delete Variant Button */}
                    <button
                        type="button"
                        className="btn delete-variant-btn"
                        onClick={() => removeProductVariant(index)}
                    >
                        Delete Variant
                    </button>
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
