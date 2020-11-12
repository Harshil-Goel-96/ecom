import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { LinkContainer } from 'react-router-bootstrap';
import { Form, Row, Col, Button, Container } from 'react-bootstrap';
import { listProductDetails, updateProduct } from '../../Actions/productActions.js';
import Loader from '../Loader.js';
import Message from '../Message.js';
import { PRODUCT_UPDATE_RESET, PRODUCT_DETAILS_RESET } from '../../Constants/productConstants.js';

const ProductEditScreen = ({ match, history }) => {

    const productId = match.params.id;

    const [name, setName] = useState("");
    const [price, setPrice] = useState(0);
    const [category, setCategory] = useState("");
    const [brand, setBrand] = useState("");
    const [stock, setStock] = useState(0);
    const [description, setDescription] = useState("");
    const [image, setImage] = useState("");
    const [uploading, setUploading] = useState(false);

    const dispatch = useDispatch();

    const productDetails = useSelector(state => state.productDetails);
    const { loading, error, product } = productDetails

    const productUpdate = useSelector(state => state.productUpdate);
    const { success: successUpdate } = productUpdate;


    useEffect(() => {

        if (successUpdate) {
            dispatch({
                type: PRODUCT_UPDATE_RESET
            });
            dispatch({
                type: PRODUCT_DETAILS_RESET
            });
            history.push("/admin/productlist");
        }
        else if (!product.name || product._id !== productId) {

            dispatch(listProductDetails(productId));
        }
        else {
            setName(product.name);
            setPrice(product.price)
            setCategory(product.category)
            setBrand(product.brand)
            setStock(product.stock)
            setDescription(product.description)
            setImage(product.image)
        }

    }, [dispatch, history, productId, successUpdate, product]);

    const formSubmitHandler = (e) => {
        e.preventDefault();
        dispatch(updateProduct({ _id: product._id, name, price, category, brand, stock, description, image }));
    }

    const uploadFileHandler = async (e) => {

        const file = e.target.files[0];
        const formData = new FormData();
        formData.append("image", file);
        setUploading(true);
        try {
            const config = {
                headers: {
                    "Content-Type": "multipart/form-data"
                }
            }
            const { data } = await axios.post("/api/uploads", formData, config);
            setUploading(false);
            setImage(data);


        } catch (error) {
            setUploading(false);
            console.log(error.message);
        }

    }
    return (
        <div style={{ flexGrow: 1 }}>
            <LinkContainer to="/admin/productlist">
                <Button variant="dark" className="m-3">
                    Go back
                </Button>
            </LinkContainer>
            <Container>
                <h1 className="text-center">EDIT PRODUCT</h1>
                {loading ? <Loader /> : error ? <Message variant="danger">{error}</Message> :
                    <Row className="justify-content-center">
                        <Col md={9}>
                            <Form onSubmit={formSubmitHandler}>
                                <Form.Row>
                                    <Form.Group as={Col} md={6} controlId="name">
                                        <Form.Label>
                                            Product Name
                                    </Form.Label>
                                        <Form.Control type="text" placeholder="Enter product Name" value={name} onChange={(e) => setName(e.target.value)} />
                                    </Form.Group>
                                    <Form.Group as={Col} md={6} controlId="price">
                                        <Form.Label>
                                            Price
                                    </Form.Label>
                                        <Form.Control type="number" placeholder="Enter Price" step={0.01} value={price} onChange={(e) => setPrice(e.target.value)} />
                                    </Form.Group>
                                    <Form.Group as={Col} md={4} controlId="category">
                                        <Form.Label>
                                            Category
                                    </Form.Label>
                                        <Form.Control type="text" placeholder="Enter Category" value={category} onChange={(e) => setCategory(e.target.value)} />
                                    </Form.Group>
                                    <Form.Group as={Col} md={4} controlId="brand">
                                        <Form.Label>
                                            Brand
                                    </Form.Label>
                                        <Form.Control type="text" placeholder="Enter Brand Name" value={brand} onChange={(e) => setBrand(e.target.value)} />
                                    </Form.Group>
                                    <Form.Group as={Col} md={4} controlId="stock">
                                        <Form.Label>
                                            Stock
                                    </Form.Label>
                                        <Form.Control type="number" placeholder="Enter Stock" value={stock} onChange={(e) => setStock(e.target.value)} />
                                    </Form.Group>
                                    <Form.Group as={Col} md={7} controlId="description">
                                        <Form.Label>
                                            Description
                                    </Form.Label>
                                        <Form.Control as="textarea" row={4} placeholder="Enter product description" value={description} onChange={(e) => setDescription(e.target.value)} />
                                    </Form.Group>
                                    <Form.Group as={Col} md={5} controlId="image">
                                        <Form.Label>
                                            Upload Image
                                    </Form.Label>
                                        <Form.Control type="text" placeholder="Enter Image url" value={image} onChange={(e) => setImage(e.target.value)} />
                                        <Form.File id="image-file" onChange={uploadFileHandler} className="mt-2">
                                        </Form.File>
                                        {uploading ? <Loader /> : null}
                                    </Form.Group>
                                    <Button variant="primary" classname="btn-block" type="submit">Update</Button>
                                </Form.Row>
                            </Form>
                        </Col>
                    </Row>
                }
            </Container>

        </div>
    )
}

export default ProductEditScreen
