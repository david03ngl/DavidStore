import { FC } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { IProduct } from '../../../redux/products/product.types';

const ProductItem: FC<IProduct> = ({ id, name, productVariants }) => {
    const navigate = useNavigate();

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
                <button className="Delete">Delete</button>
            </div>
        </div>
    );
}

export default ProductItem;
