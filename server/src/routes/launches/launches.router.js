const express = require('express')
const { httpGetAllLaunches } = require('./launches.controller')
const router = express.Router()


router.get("/launches", httpGetAllLaunches)

module.exports = router