import { FC } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import StarIcon from '@mui/icons-material/Star';
import { IProductCategory } from '../../../redux/productCategories/productCategory.types';

const ProductCategoryItem: FC<IProductCategory> = ({ id, name }) => {
    const navigate = useNavigate();

    return (
        <div className='product-item'>
            <div className='product-title'>
                <Link to={`/productCategory/${String(id)}`}>{name}</Link>
            </div>
            <div className='product-info'>
                {/*<div className='product-rating'>*/}
                {/*  <StarIcon />*/}
                {/*  {rating}*/}
                {/*</div>*/}
            </div>
            <div>
                <button onClick={() => navigate(`/productCategories/${String(id)}`)}>Edit</button>
                <button className="Delete">Delete</button>
            </div>
        </div>
    );
}

export default ProductCategoryItem;
