import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Form, Container, Row, Col, Button } from 'react-bootstrap';
import { addPaymentMethod } from '../../Actions/cartActions.js'

const PaymentPage = ({ history }) => {

    const dispatch = useDispatch();

    const cart = useSelector(state => state.cart);
    const { shippingAddress } = cart;

    if (!shippingAddress) {
        history.push("/shipping");
    }

    const [paymentMethod, setPaymentMethod] = useState("Cash On Delivery");

    const formSubmitHandler = (e) => {
        e.preventDefault();
        dispatch(addPaymentMethod(paymentMethod));
        history.push("/placeorder");
    }

    return (
        <div style={{ flexGrow: 1 }}>
            <Container className="my-3">
                <h2 className="text-center py-2 mb-0 border-bottom">PAYMENT METHOD</h2>
                <Row className="pt-2 justify-content-center">
                    <Col xs={7} md={3} >
                        <Form onSubmit={formSubmitHandler}>
                            <Form.Group id="payment">
                                <Form.Label>
                                    <em>Select Payment Mode</em>
                                </Form.Label>
                                <Col>
                                    <Form.Check type="radio" value="PayPal" label="PayPal" name="paymentmethod" onChange={(e) => setPaymentMethod(e.target.value)} />
                                    <Form.Check type="radio" value="Cash On Delivery" label="Cash On Delivery" name="paymentmethod" onChange={(e) => setPaymentMethod(e.target.value)} />
                                </Col>
                            </Form.Group>
                            <Button variant="primary" type="submit">Continue</Button>
                        </Form>
                    </Col>
                </Row>
            </Container>
        </div>
    )
}

export default PaymentPage
