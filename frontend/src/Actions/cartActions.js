import axios from 'axios';
import { CART_ADD_ITEM, CART_ADD_PAYMENT_METHOD, CART_ADD_SHIPPING_DETAILS, CART_REMOVE_ITEM } from '../Constants/cartConstants';


export const addToCart = (id, qty) => async (dispatch, getstate) => {

    const { data } = await axios.get(`/api/products/${id}`);

    dispatch({
        type: CART_ADD_ITEM,
        payload: {
            product: data._id,
            name: data.name,
            image: data.image,
            price: data.price,
            stock: data.stock,
            qty

        }
    })


    localStorage.setItem("cartItems", JSON.stringify(getstate().cart.cartItems));
}

export const removeFromCart = (id) => async (dispatch, getState) => {

    dispatch({
        type: CART_REMOVE_ITEM,
        payload: id
    })

    localStorage.setItem("cartItems", JSON.stringify(getState().cart.cartItems));

}

export const addShippingDetails = (shippingData) => async (dispatch) => {

    dispatch({
        type: CART_ADD_SHIPPING_DETAILS,
        payload: shippingData
    })

    localStorage.setItem("shipping", JSON.stringify(shippingData));

}

export const addPaymentMethod = (paymentMethod) => async (dispatch) => {

    dispatch({
        type: CART_ADD_PAYMENT_METHOD,
        payload: paymentMethod
    })

}
