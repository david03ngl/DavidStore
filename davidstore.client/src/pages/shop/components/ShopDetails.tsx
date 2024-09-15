import { useParams } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination } from 'swiper';
import StarIcon from '@mui/icons-material/Star';
import { useGetProductQuery } from '../../../redux/products/product.api';
import AddToCartBtn from '../../cart/components/AddToCartBtn';
import Loading from '../../../components/Loading';
import 'swiper/css';
import 'swiper/css/pagination';
import { useState } from 'react';

type ProductParamsId = {
  id: string;
};

const ProductDetails = () => {
  const { id } = useParams() as ProductParamsId;
    const { data: product, isLoading } = useGetProductQuery({ id });

    const [selectedVariant, setSelectedVariant] = useState<IProductVariant | null>(null);

  if (isLoading) return <Loading />;
  if (!product) return <p>Product not found</p>;

    const { name, description, price, rating, productCategory, images, id: productId, productVariants } = product;

    // Handle variant selection
    const handleVariantChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const variantId = Number(event.target.value);
        const selected = productVariants?.find(variant => variant.id === variantId) || null;
        setSelectedVariant(selected);
    };

  return (
    <div className='product-details'>
      <h1>{name}</h1>
      <div className='product-details__pics'>
        <Swiper modules={[Pagination]} pagination={{ clickable: true }} slidesPerView={1}>
          {/*{images.map(image => (*/}
          {/*  <SwiperSlide key={image}>*/}
          {/*    */}{/*<img src={image} alt={title} />*/}
          {/*  </SwiperSlide>*/}
          {/*))}*/}
        </Swiper>
      </div>
      <div className='product-details__description'>
        <p>{description}</p>
      </div>
      <div className='product-details__category'>
        <p>
            <strong>Category:</strong> {productCategory.name}
        </p>
      </div>
        {selectedVariant &&
            (
                <div className='product-details__price'>
                  <p>
                      <strong>Price:</strong> {selectedVariant.price}$
                    </p>
                </div>)}
      {/*<div className='product-details__rating'>*/}
      {/*  <div className='product-rating'>*/}
      {/*    <strong>Rating:</strong>*/}
      {/*    <StarIcon />*/}
      {/*    {rating}*/}
      {/*  </div>*/}
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
          <AddToCartBtn id={productId} price={selectedVariant?.price} variantName={selectedVariant?.name}>Add to cart</AddToCartBtn>
    </div>
  );
};

export default ProductDetails;
