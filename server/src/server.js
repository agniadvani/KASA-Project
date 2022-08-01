const http = require('http')
require('dotenv').config()
const app = require('./app')
const { mongoConnect } = require("./services/mongo")
const { loadPlanetData } = require("./models/planets.model")
const { loadLaunchData } = require("./models/launches.model")

const PORT = process.env.PORT || 8000

const server = http.createServer(app)


async function listen() {
    try {
        await mongoConnect()
        await loadPlanetData()
        await loadLaunchData()
    } catch (e) {
        console.error("Could not load start up data " + e)
    }
    server.listen(PORT, () => {
        console.log(`Listening on PORT: ${PORT}`);
    })
}


listen()


