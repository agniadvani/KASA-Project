const express = require('express')
const { httpGetAllPlanets } = require('./planets.contoller')
const planetRouter = express.Router()

planetRouter.get("/", httpGetAllPlanets)

module.exports = planetRouter