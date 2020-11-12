import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { LinkContainer } from 'react-router-bootstrap';
import { Form, Row, Col, Button, Container } from 'react-bootstrap';
import { getUserDetails, updateUser } from '../../Actions/userActions.js';
import Loader from '../Loader.js';
import Message from '../Message.js';
import { USER_DETAILS_RESET, USER_UPDATE_RESET } from '../../Constants/userConstants.js';

const UserEditScreen = ({ match, history }) => {

    const userId = match.params.id;

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [isAdmin, setIsAdmin] = useState(false);

    const dispatch = useDispatch();

    const userDetails = useSelector(state => state.userDetails);
    const { loading, error, user } = userDetails;

    const userUpdate = useSelector(state => state.userUpdate);
    const { success: successUpdate } = userUpdate;


    useEffect(() => {

        if (successUpdate) {
            dispatch({
                type: USER_UPDATE_RESET
            });
            history.push("/admin/userlist");
        }
        else {
            if (!user.name || user._id !== userId) {
                dispatch(getUserDetails(userId));
            }
            else {
                setName(user.name);
                setEmail(user.email);
                setIsAdmin(user.isAdmin);

            }
        }
    }, [dispatch, history, userId, user, successUpdate]);

    const formSubmitHandler = (e) => {
        e.preventDefault();
        dispatch(updateUser({ _id: userId, name, email, isAdmin }));
    }

    return (
        <div style={{ flexGrow: 1 }}>
            <LinkContainer to="/admin/userlist">
                <Button variant="dark" className="m-3" onClick={() => dispatch({ type: USER_DETAILS_RESET })}>
                    Go back
                </Button>
            </LinkContainer>
            <Container>
                <h1 className="text-center">EDIT USER</h1>
                <Row className="pt-3 justify-content-center">
                    {loading ? <Loader /> : error ? <Message variant="danger">{error}</Message> :
                        <Col xs={12} md={6}>
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
                                <Form.Group controlId="formGroupisAdmin">
                                    <Form.Check type="checkbox" label="Admin" checked={isAdmin} onChange={(e) => setIsAdmin(e.target.checked)} />
                                </Form.Group>
                                <Button variant="primary" type="submit">Update</Button>
                            </Form>
                        </Col>}
                </Row>
            </Container>

        </div>
    )
}

export default UserEditScreen
