import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { listProductDetails, reviewProduct } from '../../Actions/productActions.js';
import { Container, Row, Col, Image, ListGroup, Button, Form } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import Rating from '../Rating/Rating.js';
import Message from '../Message.js';
import Loader from '../Loader.js';
import { PRODUCT_CREATE_REVIEW_RESET } from '../../Constants/productConstants.js';
import { addDecimal } from '../addDecimal.js';


const ProductPage = ({ match, history }) => {

    const productId = match.params.id;
    const [qty, setQty] = useState(1);
    const [rating, setRating] = useState(1);
    const [comment, setComment] = useState("");

    const dispatch = useDispatch();

    const productDetails = useSelector(state => state.productDetails);
    const { loading, error, product } = productDetails;

    const userLogin = useSelector(state => state.userLogin);
    const { userInfo } = userLogin;

    const productReview = useSelector(state => state.productReview);
    const { error: errorReview, success: successReview } = productReview;

    useEffect(() => {

        dispatch({ type: PRODUCT_CREATE_REVIEW_RESET });

    }, [dispatch]);

    useEffect(() => {

        if (!product.name || successReview || product._id !== productId) {

            dispatch({ type: PRODUCT_CREATE_REVIEW_RESET });
            setRating(1);
            setComment("");
            dispatch(listProductDetails(match.params.id));
        }

    }, [dispatch, match, product, successReview, productId]);

    const qtyhandler = (e) => {

        setQty(Number(e.target.value));

    }

    const addToCartHandler = () => {
        history.push(`/cart/${match.params.id}?qty=${qty}`);
    }

    const createReviewHandler = (e) => {
        e.preventDefault();
        dispatch(reviewProduct({ productId, rating, comment }));
    }

    if (product.reviews) {

        product.reviews.sort((a, b) => {
            let ad = new Date(a.createdAt);
            let bd = new Date(b.createdAt);
            return bd - ad

        })
    }



    return (
        <div style={{ flexGrow: 1 }}>
            <LinkContainer to="/">
                <Button variant="dark" className="m-3">Go Back</Button>
            </LinkContainer>
            <Container>
                {loading ? <Loader /> : error ? <Message variant="danger">{error}</Message> :
                    <>
                        <Row>
                            <Col xs={12} md={4} className="d-flex align-items-stretch">
                                <Image src={product.image} fluid />
                            </Col>
                            <Col xs={12} md={5}>
                                <ListGroup variant="flush">
                                    <ListGroup.Item>
                                        <h5>{product.name}</h5>
                                        <Rating value={product.rating} />
                                    </ListGroup.Item>
                                    <ListGroup.Item>{product.description}</ListGroup.Item>
                                    <ListGroup.Item as="h5">Rs. {addDecimal(product.price)}/-</ListGroup.Item>
                                </ListGroup>
                            </Col>
                            <Col xs={12} md={3}>
                                <ListGroup>
                                    <ListGroup.Item>
                                        <Row>
                                            <Col xs={5} md={4} className="text-center">
                                                Price
                                            </Col>
                                            <Col className="text-center">
                                                Rs. {addDecimal(product.price)}
                                            </Col>
                                        </Row>
                                    </ListGroup.Item>
                                    <ListGroup.Item>
                                        <Row>
                                            <Col xs={5} md={4} className="text-center">
                                                Stock
                                            </Col>
                                            <Col className="text-center">
                                                {product.stock}
                                            </Col>
                                        </Row>
                                    </ListGroup.Item>
                                    {product.stock > 0 ?
                                        <ListGroup.Item>
                                            <Row>
                                                <Col xs={5} md={4} className="text-center">
                                                    Qty
                                            </Col>
                                                <Col className="text-center">
                                                    <Form.Control as="select" value={qty} onChange={qtyhandler}>
                                                        {[...Array(product.stock).keys()].map((x) => (
                                                            <option key={x + 1} value={x + 1}>{x + 1}</option>
                                                        ))}
                                                    </Form.Control>
                                                </Col>
                                            </Row>
                                        </ListGroup.Item> : null}

                                    <ListGroup.Item className="text-center">

                                        {
                                            product.stock <= 0 ?
                                                <Button className="btn-block" variant="warning" disabled>Out of Stock</Button>
                                                : <Button className="btn-block" variant="dark" onClick={addToCartHandler}>Add To Cart</Button>
                                        }

                                    </ListGroup.Item>
                                </ListGroup>
                            </Col>
                        </Row>

                        <Row className="my-4">
                            {!product.reviews ? <Loader /> :
                                <Col md={6}>
                                    <h4>Reviews</h4>
                                    {product.reviews.length === 0 && <Message variant="info">No reviews</Message>}
                                    <ListGroup variant="flush" style={{ fontSize: "0.8rem" }}>
                                        {
                                            product.reviews.map((rev, i) => {
                                                if (i >= 0 && i <= 2) {
                                                    return (
                                                        <ListGroup.Item key={rev._id}>
                                                            <strong>{rev.name}</strong>
                                                            <p className="text-muted my-0">Reviewed on {new Date(rev.createdAt).toLocaleDateString()}</p>
                                                            <Rating value={rev.rating} />
                                                            <p className="my-0">{rev.comment}</p>
                                                        </ListGroup.Item>)
                                                }
                                                else {
                                                    return null;
                                                }
                                            }
                                            )
                                        }
                                        <ListGroup.Item>
                                            <h4>Write a Product Review</h4>
                                            {errorReview && <Message variant="danger">{errorReview}</Message>}
                                            {userInfo ? (
                                                <Form onSubmit={createReviewHandler}>
                                                    <Form.Group controlId="rating">
                                                        <Form.Label>
                                                            Rating
                                                        </Form.Label>
                                                        <Form.Control as="select" value={rating} onChange={(e) => setRating(e.target.value)} >
                                                            {
                                                                [...Array(5).keys()].map((rat, index) => (
                                                                    <option key={index} value={rat + 1}>{rat + 1}</option>
                                                                ))
                                                            }
                                                        </Form.Control>
                                                    </Form.Group>
                                                    <Form.Group controlId="comment">
                                                        <Form.Label>
                                                            Comments
                                                        </Form.Label>
                                                        <Form.Control as="textarea" row={3} value={comment} onChange={(e) => setComment(e.target.value)} />
                                                    </Form.Group>
                                                    <Button type="submit" variant="primary">Submit Review</Button>
                                                </Form>

                                            ) : <Message variant="info">Please <Link to="/login">Sign In</Link></Message>
                                            }
                                        </ListGroup.Item>
                                    </ListGroup>

                                </Col>
                            }

                        </Row>

                    </>
                }
            </Container>
        </div >
    )
}

export default ProductPage;
