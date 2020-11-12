import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { Form, Row, Col, Button, Container } from 'react-bootstrap';
import { login } from '../../Actions/userActions.js';
import Loader from '../Loader.js';
import Message from '../Message.js';

const LoginPage = ({ location, history }) => {

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const dispatch = useDispatch();

    const userLogin = useSelector(state => state.userLogin);
    const { loading, error, userInfo } = userLogin;

    const redirect = location.search ? location.search.split("=")[1] : "/";

    useEffect(() => {

        if (userInfo) {
            history.push(redirect);
        }

    }, [userInfo, history, redirect]);

    const formSubmitHandler = (e) => {
        e.preventDefault();
        dispatch(login(email, password));
    }

    return (
        <div style={{ flexGrow: 1 }}>
            <Container>
                <Row className="pt-3 justify-content-center">
                    <Col xs="auto" md="auto">
                        <h1>Sign In</h1>
                        {loading ? <Loader /> : null}
                        {error ? <Message variant="danger">{error}</Message> : null}
                    </Col>
                </Row>
                <Row className="justify-content-center">
                    <Col xs={12} md={6} className="my-3">
                        <Form onSubmit={formSubmitHandler}>
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
                            <Button variant="primary" type="submit">Sign In</Button>
                            <p className="mt-3"> New User ? <Link to={`/register?redirect=${redirect}`}>Register</Link></p>
                        </Form>
                    </Col>
                </Row>

            </Container>

        </div>
    )
}

export default LoginPage
