import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { LinkContainer } from 'react-router-bootstrap';
import { Row, Col, Button, Container, Table } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrash } from '@fortawesome/free-solid-svg-icons';
import { deleteProduct, listProducts, createProduct } from '../../Actions/productActions';
import { PRODUCT_CREATE_RESET } from '../../Constants/productConstants.js';
import Loader from '../Loader.js';
import Message from '../Message.js';


const ProductListPage = ({ history }) => {

    const dispatch = useDispatch();

    const productList = useSelector(state => state.productList);
    const { loading, error, products } = productList;

    const productDelete = useSelector(state => state.productDelete);
    const { success: successDelete } = productDelete;

    const productCreate = useSelector(state => state.productCreate);
    const { success: successCreate, product: createdProduct } = productCreate;

    useEffect(() => {

        if (successCreate) {
            dispatch({ type: PRODUCT_CREATE_RESET });
            history.push(`/admin/product/${createdProduct._id}/edit`);
        }
        else {
            dispatch(listProducts());
        }
    }, [dispatch, history, createdProduct, successDelete, successCreate])

    const deleteHandler = (id) => {
        if (window.confirm("Are you sure?")) {
            dispatch(deleteProduct(id));
        }
    }

    const createProductHandler = () => {
        dispatch(createProduct());
    }

    return (
        <div style={{ flexGrow: 1 }}>
            {loading ? <Loader /> : error ? <Message variant="danger">{error}</Message> :
                <Container>
                    <Row className="my-3">
                        <Col xs={12} md={10} className="text-center text-md-left">
                            <h2>Products</h2>
                        </Col>
                        <Col xs={12} md={2} className="text-center text-md-right">
                            <Button variant="dark" onClick={createProductHandler}>Create Product</Button>
                        </Col>
                    </Row>
                    <Table striped bordered hover responsive variant="sm" className="text-center">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>NAME</th>
                                <th>PRICE</th>
                                <th>CATEGORY</th>
                                <th>BRAND</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                products.map(product => (
                                    <tr key={product._id}>
                                        <td>{product._id}</td>
                                        <td>{product.name}</td>
                                        <td>Rs. {product.price}</td>
                                        <td>{product.category}</td>
                                        <td>{product.brand}</td>
                                        <td>
                                            <LinkContainer to={`/admin/product/${product._id}/edit`}>
                                                <Button variant="dark" size="sm">
                                                    <FontAwesomeIcon icon={faEdit} />
                                                </Button>
                                            </LinkContainer>
                                            <Button variant="light" size="sm" onClick={() => deleteHandler(product._id)}>
                                                <FontAwesomeIcon icon={faTrash} style={{ color: "black" }} />
                                            </Button>
                                        </td>
                                    </tr>
                                ))
                            }
                        </tbody>
                    </Table>
                </Container>

            }
        </div >
    )
}

export default ProductListPage
