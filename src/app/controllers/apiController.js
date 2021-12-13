const UserData = require("../models/UserData");
const moment = require("moment");
const { convertDateToVietNam } = require("../../untils/mongosee");
module.exports.index = (req, res) => {
  res.send("apiHome");
  // res.render("layouts/search.ejs")
};
// [GET] / api /all
module.exports.getAllUser = (req, res, next) => {
  let queryParam = req.query;
  UserData.find({})
    .lean()
    .then((user) => {
      const data = convertDateToVietNam(user);
      res.json(data);
    })

    .catch((err) => next(err));
};
// [GET] / userById /filter/: slug
module.exports.getUserbyId = (req, res, next) => {
  const idUser = req.params.slug;
  UserData.find({ idUser: idUser })
    .then((user) => {
      if (user.length > 1) res.json({ data: user });
      else res.json({ err: "Id nhân viên không đúng" });
    })
    .catch((err) => next(err));
};
//[GET] Filter User By id and DateStart- DateEnd
//filter?id=36&dateStart=2021-01-01&dateEnd=2021-01-05T23:59:00.000Z
module.exports.filterUser = async (req, res, next) => {
  // Chuyen gio +7 sang UTC 0 cua BE
  const dateStart = moment(req.query.dateStart);
  const dateEnd = moment(req.query.dateEnd).add(moment.duration("23:59"));
  const idUser = req.query.id;
  const idLocal = req.query.idLocal;
  if (idUser === "null") {
    await UserData.find({
      date: {
        $gte: dateStart,
        $lt: dateEnd,
      },
    })
      .lean()
      .where("local")
      .in(idLocal)
      .sort({ idUser: "asc", date: "asc" })
      .then((user) => {
        if (user.length > 0) {
          const data = convertDateToVietNam(user);
          res.status(200).json(data);
        } else res.json({ err: "Id nhân viên không đúng" });
      })
      .catch((err) => next(err));
  }
  if (idUser !== "null") {
    await UserData.find({
      idUser: idUser,
      date: {
        $gte: new Date(dateStart).toUTCString(),
        $lt: new Date(dateEnd).toUTCString(),
      },
    })
      .lean()
      .where("local")
      .in(idLocal)
      .sort({ date: "asc" })
      .then((user) => {
        if (user.length > 1) {
          const data = convertDateToVietNam(user);
          res.status(200).json(data);
        } else res.json({ err: "Id nhân viên không đúng" });
      })
      .catch((err) => next(err));
  }
};
