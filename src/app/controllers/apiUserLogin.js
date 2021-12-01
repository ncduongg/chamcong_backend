const UserLogin = require("../models/UserLogin");
const jwt = require("jsonwebtoken");
const TOKEN_SECRET = "Submit123";
module.exports.index = (req, res) => {
  res.status(200).json({ success: "check ok" });
};
module.exports.login = (req, res, next) => {
  const data = req.body;
  if (!data.password)
    res.status(401).json({ message: "Tài khoản không tồn tại" });
  UserLogin.find({
    username: data.username,
  })
    .then((user) => {
      //res.json(user[0].password)
      if (user[0].password === data.password) {
        const Auth = jwt.sign({ username: data.username }, TOKEN_SECRET, {
          expiresIn: 60 * 60 * 24,
        });
        res.status(200).json({
          token_access: Auth,
          data: {
            id: user[0].idUserLogin,
            name: user[0].name,
            username: user[0].username,
            status: user[0].status,
          },
        });
        // res.status(200).json({ token_access: "user" })
      } else
        res.status(401).json({
          err: "Dang nhap that bai",
        });
    })
    .catch((errr) => next(errr));
};
