import { FC } from 'react';
import CartItem from './CartItem';
import { ICartProducts } from '../../../redux/cart/cart.types';

import '../cart.css';

interface ICartProps {
  setIsSubmitOrder: (isSubmitOrder: boolean) => void;
  products: ICartProducts[];
}

const Cart: FC<ICartProps> = ({ products, setIsSubmitOrder }) => {
    const handleSubmit = async (products: any) => {
        const generateRandomString = (length: number) => {
            const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
            let result = '';
            for (let i = 0; i < length; i++) {
                result += characters.charAt(Math.floor(Math.random() * characters.length));
            }
            return result;
        };

        var transactionNo = generateRandomString(10);

        var transactionDetail = [];

        var totalPrice = 0;

        for (let i = 0; i < products.length; i++) {
            totalPrice += products[i].product.price * products[i].quantity;
            transactionDetail.push({
                Id: 0,
                TransactionId: 0,
                ProductVariantId: products[i].product.variantId,
                Price: products[i].product.price,
                Qty: products[i].quantity,
                Subtotal: products[i].product.price * products[i].quantity,
                Active: true,
                CreatedUser: "admin",
                CreatedTime: new Date(),
                UpdatedUser: "admin",
                UpdatedTime: new Date()
            })
        }

        var transactionData = {
            Id: 0,
            TransactionNo: transactionNo,
            TotalAmount: totalPrice,
            Active: true,
            CreatedUser: "admin",
            CreatedTime: new Date(),
            UpdatedUser: "admin",
            UpdatedTime: new Date(),
            TransactionDetails: transactionDetail
        };

        //setIsSubmitOrder(true);
        try {
            const response = await fetch("https://localhost:7207/api/transactions", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(transactionData),
            });

            if (!response.ok) {
                throw new Error("Failed to submit transaction.");
            }

            const result = await response.json();
            console.log("Transaction submitted successfully:", result);
            alert("Transaction submitted successfully!");
        } catch (error) {
            console.error("Error:", error);
            alert("Error submitting transaction.");
        }
    }

  if (!products.length) return <p>Cart is empty</p>;

  return (
    <>
      <div className='cart-list'>
        {products.map(cartProduct => (
          <CartItem key={cartProduct.id} {...cartProduct} />
        ))}
      </div>
      <div className='cart-summary'>
        <p>
          Total Items: <strong>{products.length}</strong>
        </p>
        <p>
          Total Price:{' '}
          <strong>
            {products.reduce((acc, cur) => acc + cur.quantity * cur.product.price, 0)} $
          </strong>
        </p>
        <button
          type='button'
            className='btn'
            onClick={() => handleSubmit(products)}
          onKeyDown={() => setIsSubmitOrder(true)}
        >
          Submit Order
        </button>
      </div>
    </>
  );
};

export default Cart;
