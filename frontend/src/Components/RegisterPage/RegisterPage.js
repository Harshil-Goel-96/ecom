import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { Form, Row, Col, Button, Container } from 'react-bootstrap';
import { register } from '../../Actions/userActions.js';
import Loader from '../Loader.js';
import Message from '../Message.js';

const RegisterPage = ({ location, history }) => {

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [message, setMessage] = useState(null);

    const dispatch = useDispatch();

    const userRegister = useSelector(state => state.userRegister);
    const { loading, error, userInfo } = userRegister;

    const redirect = location.search ? location.search.split("=")[1] : "/";

    useEffect(() => {

        if (userInfo) {
            history.push(redirect);
        }

    }, [userInfo, history, redirect]);

    const formSubmitHandler = (e) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            setMessage("Password don't match");
        }
        else {
            dispatch(register(name, email, password));
        }
    }

    return (
        <div style={{ flexGrow: 1 }}>
            <Container>
                <Row className="pt-3 justify-content-center">
                    <Col xs="auto" md="auto">
                        <h1 className="text-center">Sign Up</h1>
                        {loading ? <Loader /> : null}
                        {error ? <Message variant="danger">{error}</Message> : message ? <Message variant="danger">{message}</Message> : null}
                    </Col>
                </Row>
                <Row className="justify-content-center">
                    <Col xs={12} md={6} className="my-3">
                        <Form onSubmit={formSubmitHandler}>
                            <Form.Group controlId="formGroupName">
                                <Form.Label>
                                    User Name
                                </Form.Label>
                                <Form.Control type="text" placeholder="Enter user name" value={name} onChange={(e) => setName(e.target.value)} />
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
                            <Button variant="primary" type="submit">Sign Up</Button>
                            <p className="mt-3">Already have an account ? <Link to={`/login?redirect=${redirect}`}>Login</Link></p>
                        </Form>
                    </Col>
                </Row>
            </Container>

        </div>
    )
}

export default RegisterPage
