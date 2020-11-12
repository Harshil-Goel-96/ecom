import express from 'express';
import dbConnect from './config/DB.js'
import dotenv from 'dotenv';
import path from 'path';
import productRouter from './routes/productRoutes.js';
import userRouter from './routes/userRoutes.js';
import orderRouter from './routes/orderRoutes.js';
import uploadRouter from './routes/uploadRoutes.js';
import { notFound, errorHandler } from './middleware/errorMiddleware.js'

dotenv.config();

const app = express();

dbConnect();

app.use(express.json());

//product routes
app.use("/api/products", productRouter);

//user routes
app.use("/api/users", userRouter);

//order routes
app.use("/api/orders", orderRouter);

//upload routes
app.use("/api/uploads", uploadRouter);

app.get("/api/config/paypal", (req, res) => res.send(process.env.PAYPAL_CLIENT_ID));

//making Uploads folder static.Necessary to for serving static images to /Uploads/image-###
const __dirname = path.resolve();
app.use("/Uploads", express.static(path.join(__dirname, "/Uploads")));

if (process.env.NODE_ENV === "production") {
    app.use(express.static(path.join(__dirname, "/frontend/build")));
    app.get("*", (req, res) => res.sendFile(path.resolve(__dirname, "frontend", "build", "index.html")));
} else {
    app.get("/", (req, res) => {
        res.send("API running........");
    })
}

//error-404 Not found handler
app.use(notFound);

//error handler middleware(asynchandler)
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log("Server  running on port 5000"));