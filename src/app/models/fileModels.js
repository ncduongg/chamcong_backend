const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;
const urlFile = new Schema({
    author: ObjectId,
    filename: { type: String , trim:true },
    filepath:{ type: String , trim:true },
    filesize:{ type: String , trim:true },
    filedir:{ type: String , trim:true },
    filedate:{type:Date,trim:true}
});
module.exports = mongoose.model('urlFile', urlFile)