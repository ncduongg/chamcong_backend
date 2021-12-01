const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;
const AdminLogin = new Schema({
    author: ObjectId,
    id: { type: Number, default: 0 },
    username: { type: String },
    password: { type: String },
    status: { type: String },
},{
    
});
module.exports = mongoose.model('AdminLogin', AdminLogin)