export interface ITransaction {
    id: number;
    transactionNo: string;
    totalAmount: number;
    active: boolean;
    createdUser: string;
    createdDate: string; // Or Date type if you want to handle Date objects
    updatedUser?: string;
    updatedDate?: string;
    transactionDetails?: ITransactionDetail[];
}

export interface ITransactionDetail {
    id: number;
    transactionId: number;
    productVariantId: number;
    price: number;
    qty: number;
    subtotal: number;
    active: boolean;
    createdUser: string;
    createdDate: string; // Or Date type if you want to handle Date objects
    updatedUser?: string;
    updatedDate?: string;
}

export interface IGetTransactionsResponse {
    transactions: ITransaction[];
    total: number;
    skip: number;
    limit: number;
}

export interface IGetTransactionsProps {
    limit: number;
    skip: number;
}
