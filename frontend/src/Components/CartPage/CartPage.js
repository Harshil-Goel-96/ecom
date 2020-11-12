import React, { useEffect } from 'react';
import { LinkContainer } from 'react-router-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { Row, Col, ListGroup, Image, Button, Card, Form, Container } from 'react-bootstrap';
import { addToCart, removeFromCart } from '../../Actions/cartActions.js';
import Message from '../Message.js';
import { addDecimal } from '../addDecimal.js';

const CartPage = ({ match, location, history }) => {

    const dispatch = useDispatch();

    const productId = match.params.id;
    const qty = location.search ? Number(location.search.split("=")[1]) : 1;

    const cart = useSelector(state => state.cart);
    const { cartItems } = cart;

    useEffect(() => {

        dispatch(addToCart(productId, qty));

    }, [dispatch, productId, qty]);

    const removeFromCartHandler = (id) => {

        dispatch(removeFromCart(id));
    }

    return (
        <div style={{ flexGrow: 1 }}>
            <Container className="my-3">
                <h2 className="text-center py-2 mb-0 border-bottom">CART ITEMS</h2>
                <Row>
                    <Col md={9}>
                        {cartItems.length === 0 ? <Message variant="info">Your cart is Empty <Link to="/">Go Back</Link></Message> : (
                            <ListGroup variant="flush">
                                {cartItems.map((item) => (
                                    <ListGroup.Item>
                                        <Row>
                                            <Col xs={3} md={2}>
                                                <LinkContainer to={`/product/${item.product}`}>
                                                    <Image src={item.image} alt={item.name} fluid></Image>
                                                </LinkContainer>
                                            </Col>
                                            <Col xs={9} md={4}>
                                                {item.name}
                                            </Col>
                                            <Col xs={6} md={3} className="mt-4 mt-md-0">
                                                Rs.{' '}{addDecimal(item.price)}
                                            </Col>
                                            <Col xs={4} md={2} className="mt-3 mt-md-0">
                                                <Form.Control as="select" value={item.qty} onChange={(e) => dispatch(addToCart(item.product, Number(e.target.value)))}>
                                                    {[...Array(item.stock).keys()].map((x) => (
                                                        <option key={x + 1} value={x + 1}>{x + 1}</option>
                                                    ))}
                                                </Form.Control>
                                            </Col>
                                            <Col xs={2} md={1} className="mt-3 mt-md-0">
                                                <Button type="button" variant="light" className="btn-sm-block btn-md-sm" onClick={() => removeFromCartHandler(item.product)}>
                                                    <FontAwesomeIcon icon={faTrash}>
                                                    </FontAwesomeIcon>
                                                </Button>
                                            </Col>
                                        </Row>
                                    </ListGroup.Item>
                                ))}
                            </ ListGroup>)}
                    </Col>
                    <Col md={3}>
                        <Card>
                            <ListGroup variant="flush">
                                <ListGroup.Item >
                                    <h5>TOTAL{' '}({cartItems.reduce((acc, item) => acc + item.qty, 0)}) {cartItems.reduce((acc, item) => acc + item.qty, 0) > 1 ? "ITEMS" : "ITEM"}</h5>
                                </ListGroup.Item>
                                <ListGroup.Item>
                                    <h6>Rs.{' '}{addDecimal(cartItems.reduce((acc, item) => acc + item.qty * item.price, 0))}</h6>
                                </ListGroup.Item>
                                <ListGroup.Item>
                                    <Button type="button" variant="dark" disabled={cartItems.length === 0} className="btn-block"
                                        onClick={() => history.push("/login?redirect=shipping")}>Proceed To Checkout</Button>
                                </ListGroup.Item>
                            </ListGroup>
                        </Card>
                    </Col>
                </Row>
            </Container>

        </div >
    )
}

export default CartPage;
