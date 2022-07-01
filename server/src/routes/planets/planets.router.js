const express = require('express')
const { httpGetAllPlanets } = require('./planets.contoller')
const planetRouter = express.Router()

planetRouter.get("/planets", httpGetAllPlanets)

module.exports = planetRouter