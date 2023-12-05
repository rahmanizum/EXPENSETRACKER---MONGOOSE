
const User= require('../models/users');
const Razorpay = require('razorpay');
const key_id = process.env.RAZORPAY_KEY_ID;
const key_secret = process.env.RAZORPAY_KEY_SECRET;
exports.premiummembership = async (request, response, next) => {
    try {
        const rzpintance = new Razorpay({
            key_id: key_id,
            key_secret: key_secret
        })
        var options = {
            amount: 5000,
            currency: "INR",
        };
        const orderDetails = await rzpintance.orders.create(options);
        const {user }= request;
        const {order} = user;
        const { id, status } = orderDetails;
            order.order_id =  id;
            order.status = status;
            await user.save();
            const userData = {
                name: user.name,
                email: user.email,
            }
        response.status(200).json({ key_id: key_id, orderid: id, user: userData });

    } catch (error) {
        console.log(error);
    }
}
exports.updatetransactionstatus = async (request, response, next) => {
    const { order_id, payment_id } = request.body;

    try {
        const {user }= request;
        const {order} = user;
        user.ispremiumuser = true;
        order.payment_id = payment_id;
        order.status = "Successfull";
        order.createdAt = new Date();
        await user.save();
        response.status(202).json({ success: true, message: "Thank youfor being a premium user" });
    } catch (error) {
        console.log(error);
        response.status(500).json({ success: false, message: "Error updating transaction" });
    }
}