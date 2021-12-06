const moment = require("moment");
module.exports.userFormat = (userArray) => {
  const newArrayUsers = userArray.map((x) => {
    const newUser = {
      ...x,
      //   date: new Date(date),
    };
    return newUser;
  });
  return newArrayUsers;
};
