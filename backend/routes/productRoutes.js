import express from 'express';
import asyncHandler from 'express-async-handler';
import productModel from '../models/productModel.js';
import protect from '../middleware/authMiddleware.js';
import admin from '../middleware/adminMiddleware.js';

const router = express.Router();

//@desc fetch all products
//@route GET /api/products
//@access PUBLIC
router.get("/", asyncHandler(async (req, res) => {
    const pageSize = 10;
    const keyword = req.query.keyword ? { name: { $regex: req.query.keyword, $options: "i" } } : {};
    const pageNumber = Number(req.query.page) || 1;

    const count = await productModel.find(keyword).countDocuments();
    const products = await productModel.find(keyword).limit(pageSize).skip(pageSize * (pageNumber - 1));

    res.send({ products, pageNumber, pages: Math.ceil(count / pageSize) });


}));

//@desc fetch single product
//@route GET /api/products/:id
//@access PUBLIC
router.get("/:id", asyncHandler(async (req, res) => {

    const product = await productModel.findById(req.params.id);
    if (product) {
        res.send(product);
    }
    else {
        res.status(404);
        throw new Error("Product not found");
    }

}));

//@desc delete product
//@route DELETE /api/products/:id
//@access PRIVATE/Admin
router.delete("/:id", protect, admin, asyncHandler(async (req, res) => {

    const product = await productModel.findById(req.params.id);
    if (product) {
        await product.remove();
        res.send({ message: "Product removed" });
    }
    else {
        res.status(404);
        throw new Error("Product couldn't be deleted");
    }

}));

//@desc create a product
//@route POST /api/products/
//@access PRIVATE/Admin
router.post("/", protect, admin, asyncHandler(async (req, res) => {

    const product = new productModel({
        name: "Sample name",
        price: 0,
        category: "Sample category",
        brand: "Sample brand",
        description: "Sample description",
        image: "https://images-na.ssl-images-amazon.com/images/I/51UIokwKXWL._SL1024_.jpg",
        stock: 0,
        rating: 0,
        numReviews: 0,
        user: req.user._id
    });
    if (product) {
        const newProduct = await product.save();
        res.status(201);
        res.send(newProduct);
    }
    else {
        res.status(404);
        throw new Error("Product not found");
    }
}));

//@desc update a product
//@route PUT /api/products/:id
//@access PRIVATE/Admin
router.put("/:id", protect, admin, asyncHandler(async (req, res) => {

    const { name, price, category, brand, description, image, stock, numReviews, rating } = req.body;
    const product = await productModel.findById(req.params.id);

    if (product) {
        if (name) product.name = name;
        if (price) product.price = price;
        if (category) product.category = category;
        if (brand) product.brand = brand;
        if (description) product.description = description;
        if (image) product.image = image;
        if (stock) product.stock = stock;
        if (numReviews) product.numReviews = numReviews;
        if (rating) product.rating = rating;

        const updatedProduct = await product.save();
        res.send(updatedProduct);
    }
    else {
        res.status(404);
        throw new Error("Product not found");
    }
}));

//@desc review a product
//@route POST /api/products/:id/reviews
//@access PRIVATE/Admin
router.post("/:id/reviews", protect, asyncHandler(async (req, res) => {

    const { rating, comment } = req.body;
    const product = await productModel.findById(req.params.id);

    if (product) {

        const reviewExists = product.reviews.find((rev) => rev.user.toString() === req.user._id.toString());
        if (reviewExists) {
            res.status(400);
            throw new Error("Review Already Exists");
        }

        const review = {
            name: req.user.name,
            rating,
            comment,
            user: req.user._id
        }

        product.reviews.push(review);
        product.rating = (product.reviews.reduce((acc, rev) => acc + rev.rating, 0) / product.reviews.length);
        await product.save();
        res.status(201);
        res.send({ message: "Review Added" });
    }
    else {
        res.status(404);
        throw new Error("Product not found");
    }
}));

export default router;