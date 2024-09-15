import { useParams } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination } from 'swiper';
import StarIcon from '@mui/icons-material/Star';
import { useGetProductCategoryQuery } from '../../../redux/productCategories/productCategory.api';
import AddToCartBtn from '../../cart/components/AddToCartBtn';
import Loading from '../../../components/Loading';
import 'swiper/css';
import 'swiper/css/pagination';

type ProductCategoryParamsId = {
  id: string;
};

const ProductCategoryDetails = () => {
  const { id } = useParams() as ProductCategoryParamsId;
  const { data: productCategory, isLoading } = useGetProductCategoryQuery({ id });

  if (isLoading) return <Loading />;
  if (!productCategory) return <p>Product Category not found</p>;

  const { name, images } = productCategory;

  return (
      <div className='productCategory-details'>
        <h1>{name}</h1>
        <button>Edit</button>
      </div>
  );
};

export default ProductCategoryDetails;
