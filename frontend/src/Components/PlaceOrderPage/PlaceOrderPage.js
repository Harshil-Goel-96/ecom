import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { Row, Col, Button, Container, ListGroup, Image, Card } from 'react-bootstrap';
import { createOrder } from '../../Actions/orderActions.js'
import { Link } from 'react-router-dom';
import Message from '../Message.js';
import { addDecimal } from '../addDecimal.js';
import { PayPalButton } from 'react-paypal-button-v2';
import Loader from '../Loader.js';
import { payOrder } from '../../Actions/orderActions.js';
import { ORDER_CREATE_RESET, ORDER_PAY_RESET } from '../../Constants/orderConstants.js';


const PlaceOrderPage = ({ history }) => {

    const dispatch = useDispatch();

    const [payment, setPayment] = useState({});
    const [clientId, setClientId] = useState("");


    const cart = useSelector(state => state.cart);

    cart.itemsPrice = addDecimal(cart.cartItems.reduce((acc, item) => (acc + item.price * item.qty), 0));
    cart.shippingPrice = Number(cart.itemsPrice) > 100 ? addDecimal(0) : addDecimal(Number(cart.itemsPrice) + 50);
    cart.taxPrice = addDecimal(Number(0.18 * cart.itemsPrice));
    cart.totalPrice = addDecimal(Number(cart.itemsPrice) + Number(cart.shippingPrice) + Number(cart.taxPrice));

    const orderCreate = useSelector(state => state.orderCreate);
    const { success, error, order } = orderCreate;

    const orderPay = useSelector(state => state.orderPay);
    const { success: successPay } = orderPay;


    useEffect(() => {
        const getClientId = async () => {

            const { data } = await axios.get("/api/config/paypal");
            setClientId(data);

        }
        if (cart.paymentMethod === "Cash On Delivery" && success) {
            dispatch({ type: ORDER_PAY_RESET });
            dispatch({ type: ORDER_CREATE_RESET });
            history.push(`/order/${order._id}`)

        }
        else if (order && success) {
            dispatch(payOrder(order._id, payment));
            dispatch({ type: ORDER_CREATE_RESET });
            history.push(`/order/${order._id}`)
        }
        else {
            getClientId();
        }


        // eslint-disable-next-line
    }, [history, success, successPay]);

    const placeOrderHandler = () => {

        dispatch(createOrder({
            orderItems: cart.cartItems,
            shippingAddress: cart.shippingAddress,
            paymentMethod: cart.paymentMethod,
            shippingPrice: cart.shippingPrice,
            taxPrice: cart.taxPrice,
            totalPrice: cart.totalPrice
        }))

    }

    const successPaymentHandler = (paymentResult) => {

        dispatch(createOrder({
            orderItems: cart.cartItems,
            shippingAddress: cart.shippingAddress,
            paymentMethod: cart.paymentMethod,
            shippingPrice: cart.shippingPrice,
            taxPrice: cart.taxPrice,
            totalPrice: cart.totalPrice
        }))
        setPayment(paymentResult)
    }

    return (
        <div style={{ flexGrow: 1 }}>
            <Container>
                <Row className="my-3">
                    <Col md={8}>
                        <ListGroup variant="flush">
                            <ListGroup.Item>
                                <h4>Shipping</h4>
                                <p>
                                    <strong>Address : </strong>
                                    {cart.shippingAddress.address},{' '}{cart.shippingAddress.city},
                                    {' '}{cart.shippingAddress.pinCode},{' '}{cart.shippingAddress.country}
                                </p>
                            </ListGroup.Item>
                            <ListGroup.Item>
                                <h4>Payment Method</h4>
                                <p>
                                    <strong>Mode : </strong>
                                    {cart.paymentMethod}
                                </p>
                            </ListGroup.Item>
                            <ListGroup.Item>
                                <h4>Order Items</h4>
                                {cart.cartItems.length === 0 ? <Message variant="info">Your Cart is Empty</Message> :
                                    (<ListGroup variant="flush">
                                        {cart.cartItems.map((item, index) => (
                                            <ListGroup.Item>
                                                <Row>
                                                    <Col xs={4} md={2}>
                                                        <Image src={item.image} alt={item.name} fluid />
                                                    </Col>
                                                    <Col xs={8} md={5}>
                                                        <Link to={`/product/${item.product}`} style={{ textDecoration: "none", color: "black" }}>
                                                            {item.name}
                                                        </Link>
                                                    </Col>
                                                    <Col xs={12} md={5} className="mt-3 mt-md-0 text-center">
                                                        <strong>{item.qty} x {item.price} = Rs. {addDecimal(item.qty * item.price)}</strong>
                                                    </Col>
                                                </Row>

                                            </ListGroup.Item>
                                        ))}
                                    </ListGroup>)}
                            </ListGroup.Item>
                        </ListGroup>
                    </Col>
                    <Col md={4}>
                        <Card>
                            <ListGroup variant="flush">
                                <ListGroup.Item>
                                    <h3>Order Summary</h3>
                                </ListGroup.Item>
                                <ListGroup.Item>
                                    <Row>
                                        <Col>
                                            Items
                                        </Col>
                                        <Col>
                                            Rs. {cart.itemsPrice}
                                        </Col>
                                    </Row>
                                </ListGroup.Item>
                                <ListGroup.Item>
                                    <Row>
                                        <Col>
                                            Shipping
                                        </Col>
                                        <Col>
                                            Rs. {cart.shippingPrice}
                                        </Col>
                                    </Row>
                                </ListGroup.Item>
                                <ListGroup.Item>
                                    <Row>
                                        <Col>
                                            Tax
                                        </Col>
                                        <Col>
                                            Rs. {cart.taxPrice}
                                        </Col>
                                    </Row>
                                </ListGroup.Item>
                                <ListGroup.Item>
                                    <Row>
                                        <Col>
                                            Total
                                        </Col>
                                        <Col>
                                            Rs. {cart.totalPrice}
                                        </Col>
                                    </Row>
                                </ListGroup.Item>
                                {error &&
                                    <ListGroup.Item>
                                        <Message variant="danger">{error}</Message>
                                    </ListGroup.Item>}
                                {cart.paymentMethod === "Cash On Delivery" ?
                                    <ListGroup.Item>
                                        <Button variant="dark" className="btn-block" onClick={placeOrderHandler}>Place Order</Button>
                                    </ListGroup.Item> :
                                    <ListGroup.Item>
                                        <Message variant="info"><h6 className="text-center">Make Payment</h6></Message>
                                        {!clientId ? <Loader /> :
                                            <PayPalButton amount={cart.totalPrice} onSuccess={successPaymentHandler}
                                                options={{
                                                    clientId,
                                                    currency: "INR"
                                                }} />
                                        }
                                    </ListGroup.Item>
                                }
                            </ListGroup>
                        </Card>
                    </Col>
                </Row>
            </Container>

        </div>
    )
}

export default PlaceOrderPage
