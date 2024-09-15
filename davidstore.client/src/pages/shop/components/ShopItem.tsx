import { FC, useState } from 'react';
import { Link } from 'react-router-dom';
import StarIcon from '@mui/icons-material/Star';
import { IProduct, IProductVariant } from '../../../redux/products/product.types';
import AddToCartBtn from '../../cart/components/AddToCartBtn';

const ProductItem: FC<IProduct> = ({ id, name, productVariants }) => {
    const [selectedVariant, setSelectedVariant] = useState<IProductVariant | null>(null);

    // Handle variant selection
    const handleVariantChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const variantId = Number(event.target.value);
        const selected = productVariants?.find(variant => variant.id === variantId) || null;
        setSelectedVariant(selected);
    };

    return (
        <div className='product-item'>
            <div className='product-pic'>
                <Link to={`/products/${String(id)}`}>
                    {/*<img src={''} alt={name} />*/}
                </Link>
            </div>
            <div className='product-title'>
                <Link to={`/shops/${String(id)}`}>{name}</Link>
            </div>
            {selectedVariant &&
                (<div className='product-price'>
                    ${selectedVariant.price}
                </div>)
            }
            <div className='product-info'>
                {/*<div className='product-rating'>*/}
                {/*  <StarIcon />*/}
                {/*  {rating}*/}
                {/*</div>*/}
                {productVariants && productVariants.length > 0 && (
                    <div className='variant-selector'>
                        <label htmlFor={`variant-select-${id}`}>Select Variant:</label>
                        <select
                            id={`variant-select-${id}`}
                            onChange={handleVariantChange}
                            defaultValue=""
                        >
                            <option value="" disabled>Select a variant</option>
                            {productVariants.map(variant => (
                                <option key={variant.id} value={variant.id}>
                                    {variant.name}
                                </option>
                            ))}
                        </select>
                    </div>
                )}
            </div>
            <AddToCartBtn id={id} price={selectedVariant?.price} variantName={selectedVariant?.name} variantId={selectedVariant?.id} disabled={!selectedVariant} >Buy</AddToCartBtn>
        </div>
    );
}

export default ProductItem;
