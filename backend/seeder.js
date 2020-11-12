import dotenv from 'dotenv';
import dbConnect from './config/DB.js'
import users from './users.js';
import products from './products.js';
import userModel from './models/userModel.js';
import productModel from './models/productModel.js';
import orderModel from './models/orderModel.js';
dotenv.config();
dbConnect();

export const clearData = async () => {
    try {
        await orderModel.deleteMany();
        console.log("Cleared Data !");
    }
    catch (error) {
        console.log(error.message);
    }
}

export const importData = async () => {
    try {
        const usersInDB = await userModel.insertMany(users);

        const adminUserID = usersInDB[0]._id;
        const productsInDB = products.map((prod) => {
            return ({
                ...prod, user: adminUserID

            });

        });

        await productModel.insertMany(productsInDB);
        console.log("Imported Data !");
    }
    catch (error) {
        console.log(error.message);
    }

}

if (process.argv[2] === "-d") {
    clearData();
}
else {
    importData();
}


