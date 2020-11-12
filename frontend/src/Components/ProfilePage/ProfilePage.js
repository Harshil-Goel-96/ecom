import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { LinkContainer } from 'react-router-bootstrap';
import { Table, Form, Row, Col, Button, Container } from 'react-bootstrap';
import { getUserDetails, updateUserProfile } from '../../Actions/userActions.js';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import Loader from '../Loader.js';
import Message from '../Message.js';
import { listMyOrders } from '../../Actions/orderActions.js';

const ProfilePage = ({ location, history }) => {

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [message, setMessage] = useState(null);

    const dispatch = useDispatch();

    const userDetails = useSelector(state => state.userDetails);
    const { loading, error, user } = userDetails;

    const userLogin = useSelector(state => state.userLogin);
    const { userInfo } = userLogin;

    const userUpdateProfile = useSelector(state => state.userUpdateProfile);
    const { success } = userUpdateProfile;

    const orderListMy = useSelector(state => state.orderListMy);
    const { loading: loadingOrders, error: errorOrders, orders } = orderListMy;

    useEffect(() => {

        if (!userInfo) {
            history.push("/login");
        }
        else {
            if (!user.name) {
                dispatch(getUserDetails("profile"));
                dispatch(listMyOrders());
            }
            else {
                setName(user.name);
                setEmail(user.email);
                dispatch(listMyOrders());
            }
        }

    }, [dispatch, history, userInfo, user, success]);

    const formSubmitHandler = (e) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            setMessage("Password don't match");
        }
        else {
            dispatch(updateUserProfile({ id: user._id, name, email, password }));
        }
    }

    return (
        <div style={{ flexGrow: 1 }}>
            <Container>
                <Row className="justify-content-center pt-3">
                    <Col xs={12} md={4} className="mb-4">
                        <Row className="justify-content-center">
                            <Col xs="auto">
                                <h2>User Profile</h2>
                                {loading ? <Loader /> : error ? <Message variant="danger">{error}</Message> : message ? <Message variant="danger">{message}</Message> :
                                    success ? <Message variant="success">Profile updated!</Message> : null}
                            </Col>
                            <Col xs={12} className="mt-2">
                                <Form onSubmit={formSubmitHandler}>
                                    <Form.Group controlId="formGroupName">
                                        <Form.Label>
                                            User Name
                                    </Form.Label>
                                        <Form.Control type="text" placeholder="Enter User Name" value={name} onChange={(e) => setName(e.target.value)} />
                                    </Form.Group>
                                    <Form.Group controlId="formGroupEmail">
                                        <Form.Label>
                                            Email Address
                                    </Form.Label>
                                        <Form.Control type="email" placeholder="Enter email address" value={email} onChange={(e) => setEmail(e.target.value)} />
                                    </Form.Group>
                                    <Form.Group controlId="formGroupPassword">
                                        <Form.Label>
                                            Password
                                    </Form.Label>
                                        <Form.Control type="password" placeholder="Enter password" value={password} onChange={(e) => setPassword(e.target.value)} />
                                    </Form.Group>
                                    <Form.Group controlId="formGroupConfirmPassword">
                                        <Form.Label>
                                            Confirm Password
                                    </Form.Label>
                                        <Form.Control type="password" placeholder="Confirm password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
                                    </Form.Group>
                                    <Button variant="primary" type="submit">Update</Button>
                                </Form>
                            </Col>
                        </Row>
                    </Col>


                    <Col md={8} className="text-center">
                        <h2>Orders</h2>
                        {loadingOrders ? <Loader /> : errorOrders ? <Message variant="danger">{error}</Message> :
                            <Table striped bordered hover responsive size="sm" style={{ fontSize: "0.8rem" }} className="mt-2">
                                <thead>
                                    <tr>
                                        <th>ORDER ID</th>
                                        <th>DATE</th>
                                        <th>TOTAL</th>
                                        <th>PAID</th>
                                        <th>DELIVERED</th>
                                        <th>DETAILS</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {orders.map((order) => (
                                        <tr key={order._id}>
                                            <td>{order._id}</td>
                                            <td>{order.createdAt.substring(0, 10)}</td>
                                            <td>{order.totalPrice}</td>
                                            <td>{order.isPaid ? order.paidAt.substring(0, 10) :
                                                <FontAwesomeIcon icon={faTimes} style={{ color: "red" }} />}</td>
                                            <td>{order.isDelivered ? order.deliveredAt.substring(0, 10) :
                                                <FontAwesomeIcon icon={faTimes} style={{ color: "red" }} />}</td>
                                            <td>
                                                <LinkContainer to={`/order/${order._id}`}>
                                                    <Button variant="dark" className="btn-sm">
                                                        Details
                                                    </Button>
                                                </LinkContainer>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </Table>}
                    </Col>
                </Row>
            </Container>
        </div >
    )
}

export default ProfilePage
