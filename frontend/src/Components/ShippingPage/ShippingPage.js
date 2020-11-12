import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Form, Row, Col, Button, Container } from 'react-bootstrap';
import { addShippingDetails } from '../../Actions/cartActions.js';

const ShippingPage = ({ history }) => {

    const cart = useSelector(state => state.cart);
    const { shippingAddress } = cart;

    const [address, setAddress] = useState(shippingAddress.address);
    const [city, setCity] = useState(shippingAddress.city);
    const [pinCode, setPinCode] = useState(shippingAddress.pinCode);
    const [country, setCountry] = useState(shippingAddress.country);

    const dispatch = useDispatch();

    const formSubmitHandler = (e) => {
        e.preventDefault();
        dispatch(addShippingDetails({ address, city, pinCode, country }));
        history.push("/paymentMethod");
    }


    return <div style={{ flexGrow: 1 }}>
        <Container className="my-3">
            <h2 className="text-center py-2 mb-0 border-bottom">SHIPPING DETAILS</h2>
            <Row className="pt-2 justify-content-center">
                <Col xs={12} md={6}>
                    <Form onSubmit={formSubmitHandler}>
                        <Form.Group controlId="Address">
                            <Form.Label>
                                Address
                            </Form.Label>
                            <Form.Control required type="text" placeholder="Enter shipping address" value={address} onChange={(e) => setAddress(e.target.value)} />
                        </Form.Group>
                        <Form.Group controlId="City">
                            <Form.Label>
                                City
                            </Form.Label>
                            <Form.Control required type="text" placeholder="Enter city name" value={city} onChange={(e) => setCity(e.target.value)} />
                        </Form.Group>
                        <Form.Group controlId="PinCode">
                            <Form.Label>
                                Pin Code
                            </Form.Label>
                            <Form.Control required type="text" placeholder="Enter pin code" value={pinCode} onChange={(e) => setPinCode(e.target.value)} />
                        </Form.Group>
                        <Form.Group controlId="Country">
                            <Form.Label>
                                Country
                            </Form.Label>
                            <Form.Control required type="text" placeholder="Enter country name" value={country} onChange={(e) => setCountry(e.target.value)} />
                        </Form.Group>
                        <Button variant="primary" type="submit">Continue</Button>
                    </Form>
                </Col>
            </Row>
        </Container>
    </div>

}

export default ShippingPage
