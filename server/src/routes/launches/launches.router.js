const express = require('express')
const { getAllLaunches } = require('./planets.controller')
const router = express.Router()


router.get("/launches", getAllLaunches)

module.exports = router