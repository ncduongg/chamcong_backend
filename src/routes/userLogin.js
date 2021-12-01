const express = require('express')
const router = express.Router()
const { index, login } = require("../app/controllers/apiUserLogin")
const { authenToken } = require("../app/controllers/authenToken")
router.post('/userlogin', login)
router.get('/', authenToken, index)
module.exports = router