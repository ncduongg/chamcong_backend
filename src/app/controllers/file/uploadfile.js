const util = require("util");
const multer = require("multer");
const path = require("path");
const { DateUpdate } = require("../dateFormat/DateFormar");
const maxSize = 2 * 1024 * 1024;
let storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, process.cwd() + "/src/public");
    },
    filename: (req, file, cb) => {
        cb(null, "[" + Date.now()+ "]"+file.originalname );
    },
});
const multerFilter = (req, file, cb) => {
  if (
    file.mimetype.includes("excel") ||
    file.mimetype.includes("spreadsheetml")
  ) {
    cb(null, true);
  } else {
    cb("Chỉ hỗ trợ file excel.", false);
  }
  };
let uploadFile = multer({
    storage: storage,
    limits: { fileSize: maxSize },
    fileFilter: multerFilter
}).single("file");

let uploadFileMiddleware = util.promisify(uploadFile);
module.exports = uploadFileMiddleware;