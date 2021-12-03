// dau vao 10/07/2021 17:17 ==  dau ra 2021-10-07T07:31:00.000Z
const moment = require("moment");
module.exports.DateUpdate = (date) => {
  const dateString = date;
  const dateArray = dateString.split(" ");
  const dateDayMon = dateArray[0];
  const dateTime = dateArray[1];
  // xu ly ngay
  const dateDayMonArray = dateDayMon.split("/");
  const objDate = {
    year: dateDayMonArray[2],
    day: dateDayMonArray[1],
    month: dateDayMonArray[0],
  };
  //xu ly gio
  const dateTimeArray = dateTime.split(":");
  const objTime = {
    hour: dateTimeArray[0],
    minute: dateTimeArray[1],
  };
  const dateDone =
    objDate.year + objDate.month + objDate.day + objTime.hour + objTime.minute;
  return moment(dateDone, "YYYYMMDDhhmm")
    .utcOffset("+0700")
    .format("YYYY-MM-DD HH:mm");
};
module.exports.UTCtoGMT = (UTC) => {
  const dateGTMNew = UTC.get;
};
