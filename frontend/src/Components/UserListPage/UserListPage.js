import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { LinkContainer } from 'react-router-bootstrap';
import { Button, Container, Table } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes, faCheck, faEdit, faTrash } from '@fortawesome/free-solid-svg-icons';
import { deleteUser, getUserList } from '../../Actions/userActions.js';
import Loader from '../Loader.js';
import Message from '../Message.js';


const UserListPage = () => {

    const dispatch = useDispatch();

    const userList = useSelector(state => state.userList);
    const { loading, error, users } = userList;

    const userDelete = useSelector(state => state.userDelete);
    const { success: successDelete } = userDelete;

    useEffect(() => {
        dispatch(getUserList());
    }, [dispatch, successDelete])

    const deleteHandler = (id) => {
        if (window.confirm("Are you sure ?"))
            dispatch(deleteUser(id));
    }

    return (
        <div style={{ flexGrow: 1 }}>

            <Container className="text-center my-3">
                {loading ? <Loader /> : error ? <Message variant="danger">{error}</Message> :
                    <>
                        <h2 className="mb-3">Users</h2>
                        <Table striped bordered hover responsive variant="sm">
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>NAME</th>
                                    <th>EMAIL</th>
                                    <th>ADMIN</th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    users.map(user => (
                                        <tr key={user._id}>
                                            <td>{user._id}</td>
                                            <td>{user.name}</td>
                                            <td>{user.email}</td>
                                            <td>{!user.isAdmin ? <FontAwesomeIcon icon={faTimes} style={{ color: "red" }} /> :
                                                <FontAwesomeIcon icon={faCheck} style={{ color: "green" }} />}
                                            </td>
                                            <td>
                                                <LinkContainer to={`/admin/user/${user._id}/edit`}>
                                                    <Button variant="dark" className="btn-sm mr-0 mr-md-2">
                                                        <FontAwesomeIcon icon={faEdit} />
                                                    </Button>
                                                </LinkContainer>
                                                <Button variant="light" className="btn-sm mr-0 mr-md-2" onClick={() => deleteHandler(user._id)}>
                                                    <FontAwesomeIcon icon={faTrash} style={{ color: "black" }} />
                                                </Button>
                                            </td>
                                        </tr>
                                    ))
                                }
                            </tbody>
                        </Table>
                    </>}
            </Container>
        </div>
    )
}

export default UserListPage
