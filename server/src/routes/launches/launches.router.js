const express = require('express')
const { httpGetAllLaunches, httpAddNewLaunch } = require('./launches.controller')
const router = express.Router()


router.get("/", httpGetAllLaunches)
router.post("/", httpAddNewLaunch)

module.exports = router