import React from 'react';
import { useHistory } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faShoppingCart } from '@fortawesome/free-solid-svg-icons';
import { Container, Navbar, Nav, NavDropdown } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import { logout } from '../../Actions/userActions.js';
import SearchBox from '../../Components/SearchBox.js';


const Header = () => {

    const dispatch = useDispatch();
    let history = useHistory();

    const userLogin = useSelector(state => state.userLogin);
    const { userInfo } = userLogin;

    const logoutHandler = () => {
        localStorage.removeItem("userInfo");
        dispatch(logout());
        history.push("/");
    }

    return (
        <>
            <Navbar bg="dark" variant="dark" expand="md">
                <Container>
                    <LinkContainer to="/"><Navbar.Brand>Swipe</Navbar.Brand></LinkContainer>

                    <Navbar.Toggle aria-controls="basic-navbar-nav" />
                    <Navbar.Collapse id="basic-navbar-nav">
                        <SearchBox />
                        <Nav className="ml-auto" style={{ fontSize: "0.9rem" }}>
                            <LinkContainer to="/cart">
                                <Nav.Link >
                                    <FontAwesomeIcon icon={faShoppingCart} /> Cart
                                </Nav.Link>
                            </LinkContainer>
                            {userInfo ?
                                <NavDropdown title={userInfo.name} id="username">
                                    <LinkContainer to="/profile">
                                        <NavDropdown.Item>Profile</NavDropdown.Item>
                                    </LinkContainer>
                                    <NavDropdown.Item onClick={logoutHandler}>Logout</NavDropdown.Item>
                                </NavDropdown>
                                : <LinkContainer to="/login">
                                    <Nav.Link>
                                        <FontAwesomeIcon icon={faUser} /> Login
                                    </Nav.Link>
                                </LinkContainer>
                            }
                            {
                                userInfo && userInfo.isAdmin && (
                                    <NavDropdown title="Admin Panel" id="adminuser">
                                        <LinkContainer to="/admin/userlist">
                                            <NavDropdown.Item>UserList</NavDropdown.Item>
                                        </LinkContainer>
                                        <LinkContainer to="/admin/productlist">
                                            <NavDropdown.Item>ProductList</NavDropdown.Item>
                                        </LinkContainer>
                                        <LinkContainer to="/admin/orderlist">
                                            <NavDropdown.Item>OrderList</NavDropdown.Item>
                                        </LinkContainer>
                                    </NavDropdown>
                                )
                            }
                        </Nav>
                    </Navbar.Collapse>
                </Container>
            </Navbar>
        </>
    )
}
export default Header
