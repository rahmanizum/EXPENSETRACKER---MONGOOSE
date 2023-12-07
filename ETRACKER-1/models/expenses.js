// const { getDb } = require('../util/database')
// const { ObjectId } = require('mongodb');
// class Expenses{
//     constructor(userId,category,pmethod,amount,date,id){
//         this.userId = userId;
//         this.category= category;
//         this.pmethod= pmethod;
//         this.amount= amount;
//         this.date= date;
//         this._id= id ? new ObjectId(id):null;
//     }
//     save() {
//         let db =  getDb();
//         if(this._id){
//             return db.collection('Expenses').updateOne({_id: this._id },{$set:this})
//         }else{
//             return db.collection('Expenses').insertOne(this);
//         }
//     }
//     static fetchAll(offset,limit,userId){
//         let db =  getDb();
//         return db.collection('Expenses')
//         .find({userId})
//         .skip(Number(offset))
//         .limit(Number(limit))
//         .toArray();
//     }
//     static fetchById(_id,userId){
//         let db =  getDb();
//         return db.collection('Expenses').findOne({ _id: new ObjectId(_id),userId })
//     }
//     static deleteById(_id,userId){
//         let db = getDb();
//         return db.collection('Expenses').deleteOne({ _id: new ObjectId(_id),userId })
//     }

// }

// module.exports=Expenses;

const mongoose = require('mongoose');
const { Schema } = mongoose;

const expensesSchema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        ref:'User',
        required: true
    },
    category: {
        type: String,
        required: true
    },
    pmethod: {
        type: String,
        required: true
    },
    amount: {
        type: Number,
        required: true
    },
    date: {
        type: String,
        required: true
    }
});
module.exports = mongoose.model('Expenses', expensesSchema);
