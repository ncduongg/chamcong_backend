const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;
const momenttz = require("moment-timezone");
const moment = require("moment");
const UserData = new Schema({
  author: ObjectId,
  idUser: { type: String, default: 0 },
  nameUser: { type: String, default: "Nhân Viên Chưa Được Nhậpp" },
  date: { type: Date },
  status: { type: String },
  local: { type: String },
});
module.exports = mongoose.model("UserData", UserData);
