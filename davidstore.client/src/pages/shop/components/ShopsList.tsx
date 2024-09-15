import { FC } from 'react';
import { IProduct } from '../../../redux/products/product.types';
import ShopItem from './ShopItem';
import '../shops.css';

interface IProductsListProps {
  products: IProduct[] | undefined;
}

const ProductsList: FC<IProductsListProps> = ({ products }) => (
  <div className='products-list'>
    {products?.map(product => (
      <ShopItem key={product.id} {...product} />
    ))}
  </div>
);

export default ProductsList;
