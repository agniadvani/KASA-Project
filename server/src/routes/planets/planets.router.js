const express = require('express')
const { getAllPlanets } = require('./planets.contoller')
const planetRouter = express.Router()

planetRouter.get("/planets", getAllPlanets)

module.exports = planetRouter