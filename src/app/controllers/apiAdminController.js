const path = require("path");
const xlsx = require("node-xlsx");
const AdminLogin = require("../models/AdminLogin");
const jwt = require("jsonwebtoken");
const UserData = require("../models/UserData");
const UrlFile = require("../models/fileModels");
const TOKEN_SECRET = "Submit123";
const mongoose = require("mongoose");
var _ = require("lodash");
const uploadFileMiddleware = require("./file/uploadfile");
const { DateUpdate, DateChamCong } = require("./dateFormat/DateFormar");
const vanphongModel = require("../models/vanphongModel");
const {
  clearSpaceAndLowerString,
  EditID_deviceID,
} = require("./textFormat/textFormat");
const { convertDateToVietNam } = require("../../untils/mongosee");
const moment = require("moment");
const User = require("../models/User");
module.exports.index = () => {
  res.send("apiAdmin");
};
module.exports.uploadfile = async (req, res) => {
  try {
    await uploadFileMiddleware(req, res);
    const status = req.body.status;
    if (req.file == undefined) {
      return res.status(400).send({ message: "Hãy chọn file cần upload" });
    }
    const newFile = new UrlFile({
      filename: req.file.filename,
      filepath: req.file.path,
      filesize: req.file.size,
      filedir: req.file.destination,
      filedate: moment().toLocaleString(),
      status: status,
    });
    await newFile.save();
    res.status(200).send({
      message: "Upload thành công file : " + req.file.originalname,
      dataFile: {
        filename: req.file.originalname,
        filepath: req.file.path,
        filesize: req.file.size,
        filedir: req.file.destination,
        status: status,
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
          const newArryObj = new UserData({
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
            local: "null",
          };
          dataAllNew.push(newArryObj);
        });
        res.status(200).json({
          success: "Bạn vừa Read file thành công",
          status: true,
          data: convertDateToVietNam(dataAllNew),
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
  try {
    const status = req.body.status;
    UrlFile.find({
      status: status,
    })
      .then((file) => {
        if (file.length > 0) {
          return res
            .status(200)
            .json({ message: "Success", status: true, data: file });
        }
        if (file.length === 0)
          return res.status(404).json({
            message: "Danh sách File trống",
            status: false,
            data: file,
          });
      })
      .catch((err) => next());
  } catch (error) {
    res
      .status(404)
      .json({ message: "Không lấy được danh sách File", status: false });
  }
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
    .sort({ idUser: "asc" })
    .then((user) => {
      res.status(200).json({ user: user });
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
  console.log(data);
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
            message: `Có vẻ văn phòng [${data.nameVP}] đã bị trùng trong CSDL là : ${vp}`,
            status: false,
          });
        }
        if (!choce) {
          const newVanPhong = new vanphongModel({
            nameVP: data.nameVP,
            status: data.status,
            deviceID: data.deviceID,
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
  try {
    const data = req.body;
    const chamcong = DateChamCong(data.timestamp);
    const idChamCong = data.enrollNumber;
    const deviceID = EditID_deviceID(data.deviceID);
    const dateIOS = moment(chamcong, "YYYYMMDDhhmm").toISOString(true);
    vanphongModel
      .find({
        deviceID: deviceID,
      })
      .then((vp) => {
        User.find({
          idUser: idChamCong,
          local: vp[0]._id,
        }).then((user) => {
          const newArryObj = new UserData({
            idUser: idChamCong,
            nameUser: user[0].nameUser,
            date: dateIOS,
            status: "Binh Thuong",
            local: vp[0]._id,
          });
          newArryObj.save();
        });
      });
    res.status(200).json({ message: " 22 Thanh Cong", status: true });
  } catch (error) {
    res.status(404).json({ message: "Xay ra loi", status: false, error });
  }
};
module.exports.readFileNhanVien = (req, res, next) => {
  try {
    const idfile = req.query;
    const idfileNew = Object.entries(idfile);
    const idDone = idfileNew.map((x) => {
      return x[1];
    });
    UrlFile.find({})
      .where("_id")
      .in(idDone)
      .then((listFile) => {
        const ArrayNhanVien = [];
        listFile.forEach((itemX) => {
          const obj = xlsx.parse(
            process.cwd() + `//src//public//${itemX.filename}`
          );
          const array = obj[0].data.slice(1, obj[0].data.length);
          const newArray = array.map((item) => {
            const tensau = typeof item[2] === "undefined" ? "" : item[2];
            return {
              idCC: item[0],
              name: item[1] + " " + tensau,
            };
          });
          ArrayNhanVien.push(newArray);
        });
        res.status(200).json({
          message: "Đọc thành công",
          status: true,
          data: ArrayNhanVien,
        });
      });
  } catch (error) {
    res.status(401).json({ message: "Không đọc được file", status: false });
  }
};
module.exports.writeFileNhanVien = (req, res, next) => {
  try {
    const idfile = req.body.idFile;
    const idfileNew = Object.entries(idfile);
    const idvanphong = req.body.idVanPhong[0];
    const idDone = idfileNew.map((x) => {
      return x[1];
    });

    User.find({
      local: idvanphong,
    }).then((item) => {
      UrlFile.find({})
        .where("_id")
        .in(idDone)
        .then((listFile) => {
          const ArrayNhanVien = [];
          listFile.forEach((itemX) => {
            const obj = xlsx.parse(
              process.cwd() + `//src//public//${itemX.filename}`
            );
            const array = obj[0].data.slice(1, obj[0].data.length);
            const newArray = array.map((item) => {
              const tensau = typeof item[2] === "undefined" ? "" : item[2];
              return { idCC: item[0], name: item[1] + " " + tensau };
            });
            ArrayNhanVien.push(newArray);
          });
          ArrayNhanVien[0].forEach(async (Nv) => {
            // new : true de tra lai kq sau khi thuc hien
            if (item.length > 0) {
              await User.findOneAndUpdate(
                { idUser: Nv.idCC, local: idvanphong },
                { nameUser: Nv.name },
                {
                  new: true,
                  upsert: true,
                  setDefaultsOnInsert: false,
                }
              );
            }
            if (item.length === 0) {
              const newUser = new User({
                idUser: Nv.idCC,
                nameUser: Nv.name,
                local: idvanphong,
              });
              newUser.save();
            }
          });
          res.status(200).json({
            message: "Thêm thành công File SD Nhân viên vào CSDL",
            status: true,
            data: ArrayNhanVien,
          });
        });
    });
  } catch (error) {
    res.status(401).json({ message: "Không đọc được file", status: false });
  }
};
module.exports.AddNhanVien = (req, res, next) => {
  const data = req.body;
  User.find({
    idUser: data.idCC,
  }).then((user) => {
    if (user.length > 0) {
      res.status(200).json({
        message: `ID [${data.idCC}] được gán với nhân viên ${user[0].nameUser}, nếu muốn sửa hãy chọn chức năng sửa`,
        status: false,
      });
    } else {
      const newUser = new User({
        idUser: data.idCC,
        nameUser: data.name,
        local: data.idvanphong,
      });
      newUser.save();
      res.status(200).json({
        message: `Thêm thành công nhân viên [${data.idCC}] ${data.name}`,
        status: true,
      });
    }
  });
};
module.exports.UpdateNhanVien = async (req, res, next) => {
  try {
    const nv = req.body;
    await User.findOneAndUpdate(
      {
        idUser: nv.idUser,
        local: nv.local,
      },
      {
        nameUser: nv.nameUser,
      }
    );
    res.status(200).json({
      message: `Bạn đã sửa tên Nhân Viên ID : ${nv.idUser} thành ${nv.nameUser}`,
      status: true,
    });
  } catch (error) {
    res
      .status(401)
      .json({ message: "Sửa lỗi, vui lòng xem lại", status: false });
  }
};
