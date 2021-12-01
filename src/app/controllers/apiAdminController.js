const path = require("path");
const xlsx = require("node-xlsx");
const AdminLogin = require("../models/AdminLogin");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const UrlFile = require("../models/fileModels");
const TOKEN_SECRET = "Submit123";
const mongoose = require("mongoose");
var _ = require("lodash");
const uploadFileMiddleware = require("./file/uploadfile");
const { DateUpdate } = require("./dateFormat/DateFormar");
const vanphongModel = require("../models/vanphongModel");
const { clearSpaceAndLowerString } = require("./textFormat/textFormat");
const moment = require("moment");
module.exports.index = () => {
  res.send("apiAdmin");
};
module.exports.uploadfile = async (req, res) => {
  try {
    await uploadFileMiddleware(req, res);
    if (req.file == undefined) {
      return res.status(400).send({ message: "Hãy chọn file cần upload" });
    }
    const newFile = new UrlFile({
      filename: req.file.filename,
      filepath: req.file.path,
      filesize: req.file.size,
      filedir: req.file.destination,
      filedate: moment().toLocaleString(7),
    });
    await newFile.save();
    res.status(200).send({
      message: "Upload thành công file : " + req.file.originalname,
      dataFile: {
        filename: req.file.originalname,
        filepath: req.file.path,
        filesize: req.file.size,
        filedir: req.file.destination,
      },
    });
  } catch (err) {
    res.status(200).send({
      message: `Không thể upload File: . ${err}`,
    });
  }
};
module.exports.writeFiletoCSDL = async (req, res) => {
  try {
    const idfile = req.body.idFile;
    const idvanphong = req.body.idVanPhong[0];
    const idfileNew = Object.entries(idfile);
    const idDone = idfileNew.map((x) => {
      return x[1];
    });
    await UrlFile.find()
      .where("_id")
      .in(idDone)
      .then(async (x) => {
        const dataAll = [];
        x.forEach((itemX) => {
          const obj = xlsx.parse(
            process.cwd() + `//src//public//${itemX.filename}`
          );
          const objdata = obj[0].data;
          const objArray = objdata.slice(9, objdata.length - 3);
          const ArrayChamCong = [];
          // luu du lieu id de filter
          objArray.forEach((item) => {
            const items = item.filter((n) => n != null);
            ArrayChamCong.push(items);
          });
          dataAll.push(...ArrayChamCong);
        });
        dataAll.forEach((ele) => {
          const newArryObj = new User({
            idUser: ele[0],
            nameUser: ele[1],
            date: DateUpdate(ele[2]),
            status: ele[3],
            local: idvanphong,
          });
          newArryObj.save();
        });
        res
          .status(200)
          .json({ message: "Bạn vừa Ghi file thành công", status: true });
      });
  } catch (error) {
    res.status(404).json({
      message: "Ghi file lỗi, có thể file không tồn tại",
      error,
      status: false,
    });
  }
};
module.exports.readFileNotImportData = async (req, res, next) => {
  try {
    const idfile = req.query;
    const idfileNew = Object.entries(idfile);
    const idDone = idfileNew.map((x) => {
      return x[1];
    });
    await UrlFile.find()
      .where("_id")
      .in(idDone)
      .then(async (x) => {
        const dataAll = [];
        x.forEach((itemX) => {
          const obj = xlsx.parse(
            process.cwd() + `//src//public//${itemX.filename}`
          );
          const objdata = obj[0].data;
          const objArray = objdata.slice(9, objdata.length - 3);
          const ArrayChamCong = [];
          // luu du lieu id de filter
          objArray.forEach((item) => {
            const items = item.filter((n) => n != null);
            ArrayChamCong.push(items);
          });
          dataAll.push(...ArrayChamCong);
        });
        const dataAllNew = [];
        await dataAll.forEach((ele) => {
          const newArryObj = {
            idUser: ele[0],
            nameUser: ele[1],
            date: DateUpdate(ele[2]),
            status: ele[3],
            local: "SimThangLong",
          };
          dataAllNew.push(newArryObj);
        });
        res.status(200).json({
          success: "Bạn vừa Read file thành công",
          status: true,
          data: dataAllNew,
        });
      });
  } catch (error) {
    res.status(404).json({
      err: "Đọc file lỗi, có thể file không tồn tại",
      status: false,
      error,
    });
  }
};
module.exports.getListFile = (req, res, next) => {
  UrlFile.find({})
    .then((file) => {
      res.status(200).json({ message: "Success", data: file });
    })
    .catch((err) => next());
};
module.exports.loginAdmin = async (req, res, next) => {
  try {
    const data = req.body;
    if (!data.password)
      res.status(401).json({ message: "Tài Khoản không tồn tại" });
    await AdminLogin.find({
      username: data.username,
    })
      .then((user) => {
        if (user[0].password === data.password) {
          const Auth = jwt.sign({ username: data.username }, TOKEN_SECRET, {
            expiresIn: 60 * 60 * 24,
          });
          res.status(200).json({
            token_access_admin: Auth,
            data: {
              id: user[0].id,
              username: user[0].username,
              status: user[0].status,
            },
          });
        } else
          res.status(401).json({
            err: "Dang nhap that bai",
          });
      })
      .catch((err) => next(err));
  } catch (error) {
    res.status(401).json({ message: "Lỗi đăng nhập, vui lòng liên hệ Admin" });
  }
};
module.exports.getIdAndName = async (req, res, next) => {
  const data = req.body;
  await User.find({})
    .where("local")
    .in(data)
    .then((user) => {
      const userArray = _.uniqBy(user, "idUser");
      res.status(200).json({ user: userArray });
    })
    .catch((err) => next(err));
};

module.exports.getListVP = async (req, res, next) => {
  try {
    await vanphongModel
      .find({})
      .then((data) =>
        res.status(200).json({ message: "Lấy thành công Văn Phòng", data })
      )
      .catch((error) => next(error));
  } catch (error) {
    res.status(200).json({
      message: "Không lấy được  danh sách Văn Phòng",
      status: false,
      error,
    });
  }
};
module.exports.addListVP = async (req, res, next) => {
  const data = req.body;
  try {
    await vanphongModel
      .find()
      .then((listVP) => {
        let choce = false;
        let vp = "";
        listVP.forEach((vanphong) => {
          if (
            clearSpaceAndLowerString(vanphong.nameVP) ===
            clearSpaceAndLowerString(data.nameVP)
          ) {
            choce = true;
            vp = vanphong.nameVP;
          }
        });
        if (choce) {
          res.status(200).json({
            message: `Có vẻ văn phòng [${data.nameVP}] đã bị trùng trong CSDL làC : ${vp}`,
            status: false,
          });
        }
        if (!choce) {
          const newVanPhong = new vanphongModel({
            nameVP: data.nameVP,
            status: data.status,
          });
          newVanPhong.save();
          res.status(200).json({
            message: `Thêm thành công văn phòng : ${data.nameVP}`,
            status: true,
            data: newVanPhong,
          });
        }
      })
      .catch((error) => next(error));
  } catch (error) {
    res.status(200).json({ message: "Không thêm được", status: false, error });
  }
};
module.exports.getDataMayChamCong = (req, res, next) => {
  res.status(200).json({ data: "duocne" });
};
