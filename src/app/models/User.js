const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;
const momenttz = require('moment-timezone');
const moment = require('moment')
const User = new Schema({
    author: ObjectId,
    idUser: { type: Number, default: 0 },
    nameUser: { type: String, default: "Trống" },
    date: { type: Date},
    status: { type: String },
    local: { type: String }

},{
    timestamps: true
});
module.exports = mongoose.model('User', User)