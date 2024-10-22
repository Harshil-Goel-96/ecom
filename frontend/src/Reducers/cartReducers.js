import { CART_ADD_ITEM, CART_REMOVE_ITEM, CART_ADD_SHIPPING_DETAILS, CART_ADD_PAYMENT_METHOD } from '../Constants/cartConstants.js';


export const cartReducer = (state = { cartItems: [], shippingAddress: {} }, action) => {
    switch (action.type) {
        case CART_ADD_ITEM:
            const item = action.payload;

            const itemExists = state.cartItems.find((x) => x.product === item.product);
            if (itemExists) {
                return {
                    ...state,
                    cartItems: state.cartItems.map((x) => {
                        return (x.product === item.product ? item : x)
                    })
                }

            } else {
                return {
                    ...state,
                    cartItems: [...state.cartItems, item]
                }
            }

        case CART_REMOVE_ITEM:
            return {
                ...state,
                cartItems: state.cartItems.filter((x) => x.product !== action.payload)
            }

        case CART_ADD_SHIPPING_DETAILS:
            return {
                ...state,
                shippingAddress: action.payload
            }
        case CART_ADD_PAYMENT_METHOD:
            return {
                ...state,
                paymentMethod: action.payload
            }
        default:
            return state;
    }
}