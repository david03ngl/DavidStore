import { FC } from 'react';
import useActions from '../../../redux/hooks/useActions';
import { useProductByIdSelector } from '../../../redux/products/product.slice';

interface IAddToCartBtnProps {
  id: number;
    children?: React.ReactNode;
    price?: number;
    variantName?: string,
    variantId?: number,
    disabled: boolean
}

const AddToCartBtn: FC<IAddToCartBtnProps> = ({ id, price, variantName, variantId, disabled, children }) => {
    const { addToCartProduct } = useActions();

    const product = useProductByIdSelector(id);
    const { thumbnail } = product!;

    const addToCartHandler = (productId: number, productPrice?: number, productVariantName?: string, productVariantId?: number) => {
    const cartProduct = {
        id: productId,
        quantity: 1,
        product: {
            id: productId,
            variantName: productVariantName,
            price: productPrice || 0, // Use price if available
            thumbnail,
            variantId: productVariantId,
        },
    };

    addToCartProduct(cartProduct);
  };

  return (
    <button
          className='add-to-cart-btn'
          type='button'
          data-product-id={id}
          onClick={() => addToCartHandler(id, price, variantName, variantId)}
          disabled={disabled}
          style={{ backgroundColor: disabled ? "gray" : "green" }}
    >
      {children}
    </button>
  );
};

export default AddToCartBtn;
