import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../index';
import { useTypedSelector } from '../hooks/useTypedSelector';
import { IProductCategory } from './productCategory.types';

interface ProductCategoryState {
  productCategories: IProductCategory[];
  productCategory: IProductCategory | null;
}

const initialState: ProductCategoryState = {
  productCategories: [],
  productCategory: null,
};

export const productCategorySlice = createSlice({
  name: 'productCategory',
  initialState,
  reducers: {
      setProductCategories: (state: ProductCategoryState, action: PayloadAction<IProductCategory[]>) => {
          state.productCategories = action.payload; // eslint-disable-line no-param-reassign
      },
      setProductCategory: (state: ProductCategoryState, action: PayloadAction<IProductCategory>) => {
          state.productCategory = action.payload; // eslint-disable-line no-param-reassign
      },
  },
});

export const { setProductCategories, setProductCategory } = productCategorySlice.actions;
export default productCategorySlice.reducer;

export const useProductCategoriesSelector = () =>
    useTypedSelector((state: RootState) => state.productCategory.productCategories);
export const useProductCategoryByIdSelector = (id: number | string) =>
    useTypedSelector((state: RootState) => state.productCategory.productCategories.find(productCategory => productCategory.id === id));
