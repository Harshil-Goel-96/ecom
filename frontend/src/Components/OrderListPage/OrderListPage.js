import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { LinkContainer } from 'react-router-bootstrap';
import { Button, Container, Table } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes, faCheck } from '@fortawesome/free-solid-svg-icons';
import { getOrderList } from '../../Actions/orderActions.js';
import Loader from '../Loader.js';
import Message from '../Message.js';


const OrderListPage = () => {

    const dispatch = useDispatch();

    const orderList = useSelector(state => state.orderList);
    const { loading, error, orders } = orderList;


    useEffect(() => {
        dispatch(getOrderList());
    }, [dispatch])


    return (
        <div style={{ flexGrow: 1 }}>

            <Container className="text-center my-3">
                {loading ? <Loader /> : error ? <Message variant="danger">{error}</Message> :
                    <>
                        <h2 className="mb-3">Orders</h2>
                        <Table striped bordered hover responsive variant="sm">
                            <thead>
                                <tr>
                                    <th>ORDER ID</th>
                                    <th>USER NAME</th>
                                    <th>USER ID</th>
                                    <th>PAID</th>
                                    <th>DELIVERED</th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    orders.map(order => (
                                        <tr>
                                            <td>{order._id}</td>
                                            <td>{order.user && order.user.name ? order.user.name : "Anonymous"}</td>
                                            <td>{order.user ? order.user._id : "Anonymous"}</td>
                                            <td>{!order.isPaid ? <FontAwesomeIcon icon={faTimes} style={{ color: "red" }} /> :
                                                <FontAwesomeIcon icon={faCheck} style={{ color: "green" }} />}
                                            </td>
                                            <td>{!order.isDelivered ? <FontAwesomeIcon icon={faTimes} style={{ color: "red" }} /> :
                                                <FontAwesomeIcon icon={faCheck} style={{ color: "green" }} />}
                                            </td>
                                            <td className="text-center">
                                                <LinkContainer to={`/order/${order._id}`}>
                                                    <Button variant="dark" >
                                                        Details
                                                </Button>
                                                </LinkContainer>
                                            </td>
                                        </tr>
                                    ))
                                }
                            </tbody>
                        </Table>
                    </>
                }
            </Container>
        </div >
    )
}

export default OrderListPage
