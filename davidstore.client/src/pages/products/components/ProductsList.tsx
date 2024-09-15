import { FC } from 'react';
import { IProduct } from '../../../redux/products/product.types';
import ProductItem from './ProductItem';
import '../products.css';

interface IProductsListProps {
  products: IProduct[] | undefined;
}

const ProductsList: FC<IProductsListProps> = ({ products }) => (
    <div className='products-list'>
        <button className='add-product-button'>
            Add Product
        </button>
        {products?.map(product => (
          <ProductItem key={product.id} {...product} />
        ))}
  </div>
);

export default ProductsList;
