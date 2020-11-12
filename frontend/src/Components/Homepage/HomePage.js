import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import Rating from '../Rating/Rating.js'
import { LinkContainer } from 'react-router-bootstrap';
import { listProducts } from '../../Actions/productActions.js'
import Message from '../Message.js';
import Loader from '../Loader.js';
import PaginationComponent from '../PaginationComponent.js';
import { addDecimal } from '../addDecimal.js';
import { PRODUCT_DETAILS_RESET } from '../../Constants/productConstants.js';


const HomePage = ({ match }) => {

    const keyword = match.params.keyword;
    const page = match.params.page;

    const dispatch = useDispatch();

    const productList = useSelector((state) => state.productList);
    const { loading, error, products, pageNumber, pages } = productList;

    useEffect(() => {

        dispatch(listProducts(keyword, page));
        dispatch({ type: PRODUCT_DETAILS_RESET })

    }, [dispatch, keyword, page]);


    return (
        <div style={{ flexGrow: 1 }}>
            <Container className="my-3">
                {loading ? <Loader /> : error ? <Message variant="danger">{error}</Message> :
                    (<>
                        <Row>
                            {products.map((product) => {
                                return (
                                    <Col key={product._id} xs={12} md={4} className="my-2">
                                        <Card >
                                            <LinkContainer to={`/product/${product._id}`}>
                                                <Card.Img variant="top" src={product.image} alt={product.name} />
                                            </LinkContainer>
                                            <Card.Body>
                                                <LinkContainer to={`/product/${product._id}`} style={{ cursor: "pointer" }}>
                                                    <Card.Title as="h6">{product.name}</Card.Title>
                                                </LinkContainer>
                                                <Rating value={product.rating} />
                                                <Card.Text as="h5">
                                                    Rs. {addDecimal(product.price)}
                                                </Card.Text>
                                            </Card.Body>
                                            <Card.Footer>
                                                <LinkContainer to={`/product/${product._id}`}>
                                                    <Button variant="outline-dark">Know More</Button>
                                                </LinkContainer>
                                            </Card.Footer>
                                        </Card>
                                    </Col>
                                )

                            })}
                        </Row>
                        <PaginationComponent pages={pages} pageNumber={pageNumber} keyword={keyword} />
                    </>
                    )}
            </Container>
        </div >
    )
}

export default HomePage
