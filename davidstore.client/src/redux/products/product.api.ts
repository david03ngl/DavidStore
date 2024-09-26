import { nanoid } from '@reduxjs/toolkit';
import { baseApi } from '../index.api';
import { IProduct, IGetProductsProps, IGetProductsResponse, ICategory } from './product.types';

const productApi = baseApi
  // .enhanceEndpoints({
  //     addTagTypes: ['Product'],
  // })
  .injectEndpoints({
    endpoints: build => ({
      getProducts: build.query<IGetProductsResponse, IGetProductsProps>({
        query: ({ limit, skip }) => `/product/page?limit=${limit}&skip=${skip}`,
      }),
      getProduct: build.query<IProduct, { id: string }>({
        query: ({ id }) => `/product/${id}`,
      }),
      searchProducts: build.query<IGetProductsResponse, { query: string }>({
        query: ({ query }) => `/products/search?q=${query}`,
      }),
          updateProduct: build.mutation<void, { id: number;[key: string]: any }>({
            query: (product) => ({
                url: `product/${product.id}`, // Use the product ID in the URL
                method: 'PUT',
                body: product, // Send the updated product data
                headers: {
                    'Content-Type': 'application/json', // Set Content-Type header
                },
            }),
          }),
          createProduct: build.mutation<void, { [key: string]: any }>({
              query: (product) => ({
                  url: 'product', // No ID in the URL for adding a new product
                  method: 'POST', // Use POST for adding a new product
                  body: product, // Send the new product data
                  headers: {
                      'Content-Type': 'application/json', // Set Content-Type header
                  },
              }),
          }),
    }),
  });

export const {
  useGetProductsQuery,
  useGetProductQuery,
  useSearchProductsQuery,
    useLazySearchProductsQuery,
    useUpdateProductMutation,
    useCreateProductMutation
} = productApi;
