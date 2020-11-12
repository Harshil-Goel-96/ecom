import express from 'express';
import bcrypt from 'bcryptjs';
import asyncHandler from 'express-async-handler';
import userModel from '../models/userModel.js';
import generateToken from '../utils/generateToken.js';
import protect from '../middleware/authMiddleware.js';
import admin from '../middleware/adminMiddleware.js';

const router = express.Router();

//@desc Register New user
//@route POST /api/users/
//@access PUBLIC
router.post("/", asyncHandler(async (req, res) => {
    const { name, email, password } = req.body;

    const userExists = await userModel.findOne({ email });
    if (userExists) {
        res.status(400);
        throw new Error("User already exists");
    }

    const user = await userModel.create({
        name,
        email,
        password
    });

    if (user) {
        res.status(201);
        res.send({
            _id: user._id,
            name: user.name,
            email: user.email,
            isAdmin: user.isAdmin,
            token: generateToken(user._id)
        })
    }
    else {
        res.status(400);
        throw new Error("invalid user Details");
    }

}));

//@desc Get Users list, Admin only
//@route GET /api/users/
//@access PRIVATE/Admin
router.get("/", protect, admin, asyncHandler(async (req, res) => {
    const users = await userModel.find({});
    res.send(users);
}));

//@desc Auth & get Token
//@route POST /api/users/login
//@access PUBLIC
router.post("/login", asyncHandler(async (req, res) => {

    const { email, password } = req.body;
    const user = await userModel.findOne({ email });

    if (user && await bcrypt.compare(password, user.password)) {

        res.send({
            _id: user._id,
            name: user.name,
            email: user.email,
            isAdmin: user.isAdmin,
            token: generateToken(user._id)
        })
    }
    else {
        res.status(401);
        throw new Error("Invalid email or password");

    }

}));

//@desc get user profile
//@route GET /api/users/profile
//@access PRIVATE
router.get("/profile", protect, asyncHandler(async (req, res) => {
    const user = await userModel.findById(req.user._id);
    if (user) {
        res.send({
            _id: user._id,
            name: user.name,
            email: user.email,
            isAdmin: user.isAdmin,
            token: generateToken(user._id)
        })
    }
    else {
        res.status(404);
        throw new Error("User Details not found");
    }
}));

//@desc update user profile
//@route PUT /api/users/profile
//@access PRIVATE
router.put("/profile", protect, asyncHandler(async (req, res) => {

    const user = await userModel.findById(req.user._id);

    if (user) {
        user.name = req.body.name || user.name;
        user.email = req.body.email || user.email;
        if (req.body.password) {
            user.password = req.body.password;
        }

        const updatedUser = await user.save();
        res.send({
            _id: updatedUser._id,
            name: updatedUser.name,
            email: updatedUser.email,
            isAdmin: updatedUser.isAdmin,
            token: generateToken(updatedUser._id)
        })
    }
    else {
        res.status(404);
        throw new Error("User Details not found");
    }
}));

//@desc Delete a User
//@route DELETE /api/users/:id
//@access PRIVATE/Admin
router.delete("/:id", protect, admin, asyncHandler(async (req, res) => {
    const user = await userModel.findById(req.params.id);
    if (user) {
        await user.remove();
        res.send({ message: "User Removed" });

    }
    else {
        res.status(404);
        throw new Error("User not found");
    }
}));

//@desc Get user by ID
//@route GET /api/users/:id
//@access PRIVATE/Admin
router.get("/:id", protect, admin, asyncHandler(async (req, res) => {
    const user = await userModel.findById(req.params.id).select("-password");
    if (user) {

        res.send(user);

    }
    else {
        res.status(404);
        throw new Error("User not found");
    }
}));

//@desc Update user by ID
//@route PUT /api/users/:id
//@access PRIVATE/Admin
router.put("/:id", protect, admin, asyncHandler(async (req, res) => {

    const user = await userModel.findById(req.params.id);

    if (user) {
        user.name = req.body.name || user.name;
        user.email = req.body.email || user.email;
        if (user.isAdmin !== req.body.isAdmin) {
            user.isAdmin = req.body.isAdmin;
        }

        const updatedUser = await user.save();
        res.send({
            _id: updatedUser._id,
            name: updatedUser.name,
            email: updatedUser.email,
            isAdmin: updatedUser.isAdmin
        })
    }
    else {
        res.status(404);
        throw new Error("User Details not found");
    }
}));

export default router;
