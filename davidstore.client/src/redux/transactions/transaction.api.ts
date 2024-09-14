import { nanoid } from '@reduxjs/toolkit';
import { baseApi } from '../index.api';
import { IGetTransactionsResponse, IGetTransactionsProps } from './transaction.types';

const productApi = baseApi
    // .enhanceEndpoints({
    //     addTagTypes: ['Product'],
    // })
    .injectEndpoints({
        endpoints: build => ({
            getTransactions: build.query<IGetTransactionsResponse, IGetTransactionsProps>({
                query: ({ limit, skip }) => `/transaction/page?limit=${limit}&skip=${skip}`,
            }),
            searchProducts: build.query<IGetTransactionsResponse, { query: string }>({
                query: ({ query }) => `/transaction/search?q=${query}`,
            }),
        }),
    });

export const {
    useGetTransactionsQuery,
    useSearchProductsQuery,
    useLazySearchTransactionsQuery,
} = productApi;
