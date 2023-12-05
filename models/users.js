// const { getDb } = require('../util/database');
// const { ObjectId } = require('mongodb');

// class User {
//     constructor(name,email,password,totalexpenses){
//         this.name=name;
//         this.email=email;
//         this.password=password;
//         this.totalexpenses=totalexpenses;
//         this.ispremiumuser=false;
//         this.downloadUrl = [];
//         this.forgotPassword = {};
//         this.order = {};
//     }
//     save(){
//         let db=getDb();
//         return db.collection('Users').insertOne(this);
//     }
//     static fetchByEmail(email){
//         let db=getDb();
//         return db.collection('Users').findOne({email});
//     }
//     static fetchById(_id) {
//         const db = getDb();
//         return db.collection('Users').findOne({ _id: new ObjectId(_id) });
//     }
//     static createForgotPassword(_id, obj) {
//         const db = getDb();
//         return db.collection('Users').updateOne({ _id }, { $set: { "forgotPassword": obj } })
//     }
//     static updateForgotPassword(_id, obj) {
//         const db = getDb();
//         return db.collection('Users').updateOne({ _id }, { $set: { "forgotPassword": obj } })
//     }
//     static updatePassword(_id, password) {
//         const db = getDb();
//         return db.collection('Users').updateOne({ _id }, { $set: { "password": password } })
//     }
//     static fetchByForgotId(forgotId) {
//         const db = getDb();
//         return db.collection('Users').findOne({ "forgotPassword.forgotId": forgotId });
//     }
//     static createOrder(userId,order){
//         const db = getDb();
//         return db.collection("Users")
//         .updateOne({_id : new ObjectId(userId)},{$set:{"order":order }});   
//     }
//     static updateOrder(UsersId,order){
//         const db = getDb();
//         return db.collection("Users")
//         .updateOne({_id : new ObjectId(UsersId)},{$set:{ "order":order ,"ispremiumuser":true}});   
//     }
//     static saveDownloadHistory(_id,url){
//         const db=getDb();
//         return db.collection('Users').updateOne({_id : new ObjectId(_id)},{$push:{"downloadUrl":url}});
//     }

// }
// module.exports=User;
const Expenses = require('./expenses');
const mongoose = require('mongoose');
const { Schema } = mongoose;

const userSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    totalexpenses: {
        type: Number,
        default: 0
    },
    ispremiumuser: {
        type: Boolean,
        default: false
    },
    downloadUrl: [{
        url:{
            type:String
        },
        createdAt:{
            type:Date,
        }
}],
    forgotPassword: [{
        isActive:{
            type : Boolean,
        },
        createdAt:{
            type : Date,
        }
    }],
    order: {
        order_id:{
            type:String
        },
        status:{
            type:String
        },
        payment_id:{
            type:String
        },
        createdAt:{
            type:Date
        }
    }
});

userSchema.methods.updateTotal = async function(){
const expenses = await Expenses.find({userId:this._id},'amount -_id');
let total = expenses.reduce((accumulator,item)=>accumulator+item.amount,0);
this.totalexpenses = total;
return this.save();
}
module.exports = mongoose.model('User', userSchema);
