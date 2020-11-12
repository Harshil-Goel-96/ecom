import mongoose from 'mongoose';
import userModel from './userModel.js'

const reviewSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    rating: {
        type: Number,
        required: true
    },
    comment: {
        type: String,
        required: true
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: userModel
    }

}, {
    timestamps: true
});

const productSchema = new mongoose.Schema({

    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: userModel
    },
    name: {
        type: String,
        required: true

    },
    image: {
        type: String,
        required: true,

    },
    brand: {
        type: String,
        required: true

    },
    category: {
        type: String,
        required: true,

    },
    description: {
        type: String,
        required: true,

    },
    reviews: [reviewSchema],
    rating: {
        type: Number,
        required: true,
        default: 0

    },
    numReviews: {
        type: Number,
        required: true,
        default: 0

    },
    price: {
        type: Number,
        set: (num) => {
            const no = Number(num).toFixed(2);
            return no;
        },
        required: true,
        default: 0
    },
    stock: {
        type: Number,
        required: true,
        default: 0
    }

}, {
    timestamps: true
});

const productModel = mongoose.model("products", productSchema);

export default productModel;

