const express = require('express')
const router = express.Router()
const NewController = require('../app/controllers/newController')
router.get('/:slug', NewController.show)
router.get('/', NewController.main)
module.exports = router