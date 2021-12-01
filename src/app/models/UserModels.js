const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

const UserModel = new Schema({
    author: ObjectId,
    idUser: { type: Number, default: 0 },
    nameUser: { type: String, default: "Trống" },
    date: { type: Date },
    status: { type: String },
    local: { type: String }

});
module.exports = mongoose.model('UserModel', UserModel)