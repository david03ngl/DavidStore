import { FC } from 'react';
import { IProductCategory } from '../../../redux/productCategories/productCategory.types';
import ProductCategoryItem from './ProductCategoryItem';
import '../productCategories.css';

interface IProductCategoriesListProps {
    productCategories: IProductCategory[] | undefined;
}

const ProductsList: FC<IProductCategoriesListProps> = ({ productCategories }) => (
  <div className='products-list'>
        {productCategories?.map(productCategory => (
        <ProductCategoryItem key={productCategory.id} {...productCategory} />
    ))}
  </div>
);

export default ProductsList;
