export interface IProduct {
    id: number;
    plu: string;
    name: string;
    productCategoryId: number;
    active: boolean;
    createdUser: string;
    createdDate: string;
    updatedUser: string;
    updatedDate: string;
    productCategory: {
        id: number;
        name: string;
        active: boolean;
        createdUser: string;
        createdDate: string;
        updatedUser: string;
        updatedDate: string;
    } | null;
    productVariants: IProductVariant[];
}

export interface IProductVariant {
    id: number;
    code: string;
    name: string;
    imageLocation: string;
    qty: number;
    price: number;
    active: boolean;
    createdUser: string;
    createdDate: string;
    updatedUser: string;
    updatedDate: string;
}

export interface IGetProductsResponse {
  products: IProduct[];
  total: number;
  skip: number;
  limit: number;
}

export interface IGetProductsProps {
  limit: number;
  skip: number;
}

export interface ICategory {
  id: string;
  name: string;
}
