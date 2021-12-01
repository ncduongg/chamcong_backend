const mongoose = require('mongoose')
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;
const vanphongModel = new Schema({
    author: ObjectId,
    nameVP: { type: String, trim: true},
    status: { type: String ,trim:true},
});
module.exports = mongoose.model('vanphongModel', vanphongModel)