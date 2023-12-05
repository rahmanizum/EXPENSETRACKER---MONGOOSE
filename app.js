//Starting of app.js file
require('dotenv').config();
const express = require('express');
const cors = require('cors');

const mongoose = require('mongoose');
const uri = `mongodb+srv://${process.env.MONGODB_USERNAME}:${process.env.MONGODB_PASSWORD}@cluster0.stwjmc7.mongodb.net/EexpenseMongoose?retryWrites=true&w=majority`;

const PORT = process.env.PORT;

const mainPageRouter = require('./routes/mainpage');
const userRouter = require('./routes/user');
const expenseRouter = require('./routes/expenses');
const purchaseRouter = require('./routes/purchase');
const premiumRouter = require('./routes/premium');
const passwordRouter = require('./routes/password');

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended:false}));
app.use(express.static('public'));

app.use(mainPageRouter)
app.use('/user',userRouter);
app.use('/purchase',purchaseRouter);
app.use('/expenses',expenseRouter);
app.use('/premium',premiumRouter);
app.use('/password',passwordRouter);

async function initiate(){
    try {
        await mongoose.connect(uri)
        app.listen(PORT,()=>{
            console.log(`Server is running at ${PORT}`);
        });       
    } catch (error) {
        console.log(error);
    }
}
initiate();
