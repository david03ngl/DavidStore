import { FC } from 'react';
import { IProduct } from '../../../redux/products/product.types';
import ProductItem from './ProductItem';
import { useNavigate } from 'react-router-dom';
import '../products.css';

interface IProductsListProps {
  products: IProduct[] | undefined;
}

const ProductsList: FC<IProductsListProps> = ({ products }) => {
    const navigate = useNavigate();

    return (
        <div className='products-list'>
            <button className='add-product-button' onClick={() => navigate('/products/add')}>
                Add Product
            </button>
            {products?.map(product => (
                <ProductItem key={product.id} {...product} />
            ))}
        </div>
    );
}

export default ProductsList;
