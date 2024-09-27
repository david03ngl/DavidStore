import { FC } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { IProduct } from '../../../redux/products/product.types';
import { useDeleteProductMutation } from '../../../redux/products/product.api';

const ProductItem: FC<IProduct> = ({ id, name, productVariants }) => {
    const [deleteProduct] = useDeleteProductMutation();
    const navigate = useNavigate();

    const handleDelete = async (id: number) => {
        if (window.confirm("Are you sure you want to delete this product?")) {
            try {
                await deleteProduct({ id }).unwrap();  // Trigger the mutation and wait for the result
                alert('Product deleted successfully');
                window.location.reload();
            } catch (error) {
                console.error('Failed to delete product:', error);
                alert('Failed to delete product');
            }
        }
    };

    return (
        <div className='product-item'>
            <div className='product-pic'>
                <Link to={`/products/${String(id)}`}>
                    {/*<img src={''} alt={name} />*/}
                </Link>
            </div>
            <div className='product-title'>
                <Link to={`/products/${String(id)}`}>{name}</Link>
            </div>
            <div className='product-title'>
                {productVariants?.map((item, index) => (
                    <li key={index}>{item.name}</li>
                ))}
            </div>
            <div>
                <button onClick={() => navigate(`/products/${String(id)}`)}>Edit</button>
                <button className="Delete" onClick={() => handleDelete(id)}>Delete</button>
            </div>
        </div>
    );
}

export default ProductItem;
