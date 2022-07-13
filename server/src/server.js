const http = require('http')
const cluster = require('cluster')
const os = require('os')
const mongoose = require('mongoose')
const app = require('./app')

const { loadPlanetData } = require("./models/planets.model")

const PORT = process.env.PORT || 8000
const DB_URL = "mongodb+srv://agni:agni1203@cluster0.jdry5ct.mongodb.net/kasa?retryWrites=true&w=majority"

const server = http.createServer(app)

mongoose.connection
    .once("open", () => {
        console.log("Db connected")
    })
    .on('error', (err) => {
        console.error(err)
    })

async function listen() {
    try {
        await mongoose.connect(DB_URL)
        await loadPlanetData()
    } catch (e) {
        console.error("Could not load planet data " + e)
    }
    server.listen(PORT, () => {
        console.log(`Listening on PORT: ${PORT}`);
    })
}


listen()


