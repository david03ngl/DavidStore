import { baseApi } from '../index.api';
import { IProductCategory, IGetProductCategoriesProps, IGetProductCategoriesResponse } from './productCategory.types';

const productCategoryApi = baseApi
  .injectEndpoints({
    endpoints: build => ({
      getProductCategories: build.query<IGetProductCategoriesResponse, IGetProductCategoriesProps>({
        query: ({ limit, skip }) => `/productCategories/page?limit=${limit}&skip=${skip}`,
      }),
      getProductCategory: build.query<IProductCategory, { id: string }>({
        query: ({ id }) => `/productCategories/${id}`,
      }),
      searchProductCategories: build.query<IGetProductCategoriesResponse, { query: string }>({
        query: ({ query }) => `/productCategories/search?q=${query}`,
      }),
    }),
  });

export const {
  useGetProductCategoriesQuery,
  useGetProductCategoryQuery,
  useSearchProductCategoriesQuery,
  useLazySearchProductCategoriesQuery,
} = productCategoryApi;
