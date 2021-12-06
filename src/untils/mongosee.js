const moment = require("moment");
module.exports = {
  convertDateToVietNam: (user) => {
    const newUserArray = user.map((x) => {
      let newDefined = {
        ...x,
        date: moment(x.date).format("YYYY-MM-DD HH:mm").toLocaleString(),
      };
      return newDefined;
    });
    return newUserArray;
  },
};
