const express = require('express')
const router = express.Router()
const { authenToken } = require("../app/controllers/authenToken")
const { index, adduser, getAllUser, filterUser, getUserbyId } = require('../app/controllers/apiController')
router.get('/filter', filterUser)
router.get('/all',getAllUser)
router.get('/', index)
module.exports = router