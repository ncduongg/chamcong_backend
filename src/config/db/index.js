const mongoose = require("mongoose");
const connect = async () => {
  const uri2 = "mongodb://localhost:27017/test_dev";
  try {
    await mongoose.connect(uri2);
    console.log("connect ok");
  } catch (error) {
    console.log("meo duoc");
  }
};
module.exports = { connect };
