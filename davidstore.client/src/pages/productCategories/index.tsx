import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { useGetProductCategoriesQuery } from '../../redux/productCategories/productCategory.api';
import ProductCategoriesList from './components/ProductCategoriesList';
import Loading from '../../components/Loading';
import ErrorMessage from '../../components/ErrorMessage';
import Pagination from '../../components/Pagination';

const ProductCategoriesPage = () => {
  const [activePage, setActivePage] = useState(1);
  const { data, error, isLoading } = useGetProductCategoriesQuery({
    limit: 10,
    skip: (activePage - 1) * 10,
  });

  if (isLoading) return <Loading />;
  if (error) return <ErrorMessage error={error} />;

  return (
    <>
        <h1>Products</h1>
        <ProductCategoriesList productCategories={data?.productCategories} />
        <Pagination
            activePage={activePage}
            setActivePage={setActivePage}
            total={data?.total}
            limit={data?.limit}
        />
        <Outlet />
    </>
  );
};

export default ProductCategoriesPage;
