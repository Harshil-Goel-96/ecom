import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { LinkContainer } from 'react-router-bootstrap';
import { PayPalButton } from 'react-paypal-button-v2';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome } from '@fortawesome/free-solid-svg-icons';
import { useDispatch, useSelector } from 'react-redux';
import { Row, Col, Container, ListGroup, Image, Card, Button, Alert } from 'react-bootstrap';
import { deliverOrder, getOrderDetails, payOrder } from '../../Actions/orderActions.js'
import { Link } from 'react-router-dom';
import Message from '../Message.js';
import Loader from '../Loader.js';
import { ORDER_DELIVER_RESET, ORDER_PAY_RESET } from '../../Constants/orderConstants.js';
import { addDecimal } from '../addDecimal.js';


const OrderPage = ({ match }) => {

    const orderId = match.params.id;

    const dispatch = useDispatch();

    const [clientId, setClientId] = useState("");

    const userLogin = useSelector(state => state.userLogin);
    const { userInfo } = userLogin;

    const orderDetails = useSelector(state => state.orderDetails);
    const { loading, error, order } = orderDetails;

    const orderPay = useSelector(state => state.orderPay);
    const { loading: loadingPay, success: successPay } = orderPay;

    const orderDeliver = useSelector(state => state.orderDeliver);
    const { success: successDeliver } = orderDeliver;

    if (!loading) {
        order.itemsPrice = (order.orderItems.reduce((acc, item) => (acc + item.price * item.qty), 0));
    }

    useEffect(() => {
        const getClientId = async () => {

            const { data } = await axios.get("/api/config/paypal");
            setClientId(data);

        }

        if (!order || successPay || successDeliver || order._id !== orderId) {
            dispatch({ type: ORDER_PAY_RESET });
            dispatch({ type: ORDER_DELIVER_RESET });
            dispatch(getOrderDetails(orderId))
        }
        else {
            if (!order.isPaid) {
                getClientId();
            }
        }
    }, [order, orderId, successPay, successDeliver, dispatch]);

    const successPaymentHandler = (paymentResult) => {

        dispatch(payOrder(orderId, paymentResult));

    }

    const successDeliveredHandler = () => {

        dispatch(deliverOrder(orderId));

    }


    return (
        <div style={{ flexGrow: 1 }}>
            {loading ? <Loader /> : error ? <Message variant="danger">{error}</Message> :
                <Container>
                    {userInfo && userInfo.isAdmin ?
                        <LinkContainer to="/admin/orderlist">
                            <Button variant="dark" className="my-2">Go Back</Button>
                        </LinkContainer> :
                        <LinkContainer to="/">
                            <Button variant="dark" className="my-2"><FontAwesomeIcon icon={faHome} /> Home</Button>
                        </LinkContainer>
                    }
                    <Alert variant="success">ORDER ID - <strong>{order._id}</strong></Alert>
                    <Row>
                        <Col md={8}>
                            <ListGroup variant="flush">
                                <ListGroup.Item>
                                    <h3>Shipping</h3>
                                    <p><strong>Name: </strong>{order.user.name}</p>
                                    <p><strong>Email: </strong>{order.user.email}</p>
                                    <p>
                                        <strong>Address : </strong>
                                        {order.shippingAddress.address},{' '}{order.shippingAddress.city},
                                    {' '}{order.shippingAddress.pinCode},{' '}{order.shippingAddress.country}
                                    </p>
                                    {order.isDelivered ? <Message variant="success">Delivered on {new Date(order.deliveredAt).toLocaleDateString()}</Message> :
                                        <Message variant="danger">Not Delivered</Message>}
                                </ListGroup.Item>
                                <ListGroup.Item>
                                    <h3>Payment Method</h3>
                                    <p>
                                        <strong>Mode : </strong>
                                        {order.paymentMethod}
                                    </p>
                                    {order.isPaid ? <Message variant="success">Paid on {new Date(order.paidAt).toLocaleDateString()}</Message> :
                                        <Message variant="danger">Not Paid</Message>}
                                </ListGroup.Item>
                                <ListGroup.Item>
                                    <h3>Order Items</h3>
                                    {order.orderItems.length === 0 ? <Message variant="info">Order is Empty</Message> :
                                        (<ListGroup variant="flush">
                                            {order.orderItems.map((item, index) => (
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
                                                        <Col xs={12} md={5} className="mt-3 mt-md-0 text-center" style={{ fontSize: "0.9rem" }}>
                                                            <strong>{item.qty} x {addDecimal(item.price)} = Rs. {addDecimal(item.qty * item.price)}</strong>
                                                        </Col>
                                                    </Row>

                                                </ListGroup.Item>
                                            ))}
                                        </ListGroup>)}
                                </ListGroup.Item>
                            </ListGroup>
                        </Col>
                        <Col md={4}>
                            <Card className="my-2 my-md-0">
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
                                                Rs {addDecimal(order.itemsPrice)}
                                            </Col>
                                        </Row>
                                    </ListGroup.Item>
                                    <ListGroup.Item>
                                        <Row>
                                            <Col>
                                                Shipping
                                        </Col>
                                            <Col>
                                                Rs {addDecimal(order.shippingPrice)}
                                            </Col>
                                        </Row>
                                    </ListGroup.Item>
                                    <ListGroup.Item>
                                        <Row>
                                            <Col>
                                                Tax
                                        </Col>
                                            <Col>
                                                Rs {addDecimal(order.taxPrice)}
                                            </Col>
                                        </Row>
                                    </ListGroup.Item>
                                    <ListGroup.Item>
                                        <Row>
                                            <Col>
                                                Total
                                        </Col>
                                            <Col>
                                                Rs {addDecimal(order.totalPrice)}
                                            </Col>
                                        </Row>
                                    </ListGroup.Item>
                                    {!order.isPaid &&
                                        <ListGroup.Item>
                                            {loadingPay && <Loader />}
                                            {!clientId ? <Loader /> :
                                                <PayPalButton amount={order.totalPrice} onSuccess={successPaymentHandler}
                                                    options={{
                                                        clientId,
                                                        currency: "INR"
                                                    }} />
                                            }
                                        </ListGroup.Item>
                                    }
                                    {
                                        userInfo && userInfo.isAdmin && !order.isDelivered && order.isPaid &&
                                        (<ListGroup.Item>
                                            <Button variant="warning" onClick={successDeliveredHandler} className="btn-block">
                                                Mark as Delivered
                                            </Button>
                                        </ListGroup.Item>)
                                    }
                                </ListGroup>
                            </Card>
                        </Col>
                    </Row>
                </Container>
            }
        </div>
    )
}

export default OrderPage
