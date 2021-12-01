const mongoose = require('mongoose')
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;
const UserLogin = new Schema({
    author: ObjectId,
    idUserLogin: { type: Number, default: 0 },
    name: { type: String ,trim:true},
    username: { type: String },
    password: { type: String },
    status: { type: String },
});
module.exports = mongoose.model('UserLogin', UserLogin)