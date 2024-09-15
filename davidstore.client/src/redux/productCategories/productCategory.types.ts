export interface IProductCategory {
    id: number;
    name: string;
    active: boolean;
    createdUser: string;
    createdDate: string;
    updatedUser: string;
    updatedDate: string;
}

export interface IGetProductCategoriesResponse {
  productCategories: IProductCategory[];
  total: number;
  skip: number;
  limit: number;
}

export interface IGetProductCategoriesProps {
  limit: number;
  skip: number;
}
