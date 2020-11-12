import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import './App.css';
import Footer from './Components/Footer/Footer';
import Header from './Components/Header/Header';
import HomePage from './Components/Homepage/HomePage';
import ErrorPage from './Components/ErrorPage.js'
import ProductPage from './Components/ProductPage/ProductPage';
import CartPage from './Components/CartPage/CartPage';
import LoginPage from './Components/LoginPage/LoginPage';
import RegisterPage from './Components/RegisterPage/RegisterPage';
import ProfilePage from './Components/ProfilePage/ProfilePage';
import ShippingPage from './Components/ShippingPage/ShippingPage';
import PaymentPage from './Components/PaymentPage/PaymentPage';
import PlaceOrderPage from './Components/PlaceOrderPage/PlaceOrderPage';
import OrderPage from './Components/OrderPage/OrderPage';
import UserListPage from './Components/UserListPage/UserListPage';
import UserEditScreen from './Components/UserEditScreen/UserEditScreen';
import ProductListPage from './Components/ProductListPage/ProductListPage';
import ProductEditScreen from './Components/ProductEditScreen/ProductEditScreen.js'
import OrderListPage from './Components/OrderListPage/OrderListPage';

function App() {
  return (
    <Router>
      <div className="app-container">
        <Header />
        <Switch>
          <Route path="/profile" component={ProfilePage} />
          <Route path="/register" component={RegisterPage} />
          <Route path="/login" component={LoginPage} />
          <Route path="/admin/userlist" component={UserListPage} />
          <Route path="/admin/productlist" component={ProductListPage} />
          <Route path="/admin/orderlist" component={OrderListPage} />
          <Route path="/admin/user/:id/edit" component={UserEditScreen} />
          <Route path="/" component={HomePage} exact />
          <Route path="/search/:keyword" component={HomePage} exact />
          <Route path="/page/:page" component={HomePage} />
          <Route path="/search/:keyword/page/:page" component={HomePage} />
          <Route path="/product/:id" component={ProductPage} />
          <Route path="/admin/product/:id/edit" component={ProductEditScreen} />
          <Route path="/cart/:id?" component={CartPage} />
          <Route path="/shipping" component={ShippingPage} />
          <Route path="/paymentMethod" component={PaymentPage} />
          <Route path="/placeorder" component={PlaceOrderPage} />
          <Route path="/order/:id" component={OrderPage} />
          <Route component={ErrorPage} />
        </Switch>
        <Footer />
      </ div>
    </Router>
  );
}

export default App;
