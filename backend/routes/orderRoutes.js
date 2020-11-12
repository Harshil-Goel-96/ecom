import express from 'express';
import asyncHandler from 'express-async-handler';
import orderModel from '../models/orderModel.js';
import protect from '../middleware/authMiddleware.js';
import admin from '../middleware/adminMiddleware.js';

const router = express.Router();

//@desc create order
//@route POST /api/orders/
//@access PRIVATE
router.post("/", protect, asyncHandler(async (req, res) => {

    const { orderItems, shippingAddress, paymentMethod, taxPrice, shippingPrice, totalPrice } = req.body;
    if (orderItems && orderItems.length === 0) {
        res.status(400);
        throw new Error("Order Details missing");
    }
    else {
        const order = new orderModel({
            user: req.user._id,
            orderItems,
            shippingAddress,
            paymentMethod,
            taxPrice,
            shippingPrice,
            totalPrice

        });

        const createdOrder = await order.save();
        res.status(201);
        res.send(createdOrder);
    }

}))

//@desc Fetch Orders List
//@route GET /api/orders/
//@access PRIVATE/Admin only
router.get("/", protect, admin, asyncHandler(async (req, res) => {
    const orders = await orderModel.find({}).populate("user", "name email");
    if (orders) {
        res.send(orders);
    }
    else {
        res.status(404);
        throw new Error("Orders Not Found")
    }
}))

//@desc get logged in user orders
//@route GET /api/orders/myorders
//@access PRIVATE
router.get("/myorders", protect, asyncHandler(async (req, res) => {
    const orders = await orderModel.find({ user: req.user._id });
    res.send(orders);
}))

//@desc get order details
//@route GET /api/orders/:id
//@access PRIVATE
router.get("/:id", protect, asyncHandler(async (req, res) => {

    const order = await orderModel.findById(req.params.id).populate("user", "name email");
    if (order) {
        res.send(order);
    }
    else {
        res.status(404);
        res.send("Order not Found");
    }

}))

//@desc update order to paid
//@route PUT /api/orders/:id/pay
//@access PRIVATE
router.put("/:id/pay", protect, asyncHandler(async (req, res) => {

    const order = await orderModel.findById(req.params.id);
    const date = new Date(req.body.create_time).toLocaleDateString()
    console.log(date)

    if (order) {
        order.isPaid = true;
        order.paidAt = Date.now();
        order.paymentResult = {
            id: req.body.id,
            status: req.body.status,
            emailAddress: req.body.payer.email_address
        }

        const updatedOrder = await order.save();
        res.send(updatedOrder);
    }
    else {
        res.status(404);
        res.send("Order not Found");
    }

}))

//@desc update order to delivered
//@route PUT /api/orders/:id/deliver
//@access PRIVATE
router.put("/:id/deliver", protect, asyncHandler(async (req, res) => {

    const order = await orderModel.findById(req.params.id);
    if (order) {
        order.isDelivered = true;
        order.deliveredAt = Date.now();

        const updatedOrder = await order.save();
        res.send(updatedOrder);
    }
    else {
        res.status(404);
        res.send("Order not Found");
    }

}))

export default router;