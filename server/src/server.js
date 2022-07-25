const http = require('http')
const app = require('./app')
const { mongoConnect } = require("./services/mongo")
const { loadPlanetData } = require("./models/planets.model")
const { loadLaunchData } = require("./models/launches.model")

const PORT = process.env.PORT || 8000

const server = http.createServer(app)


async function listen() {
    try {
        await loadLaunchData()
        await mongoConnect()
        await loadPlanetData()
    } catch (e) {
        console.error("Could not load start up data " + e)
    }
    server.listen(PORT, () => {
        console.log(`Listening on PORT: ${PORT}`);
    })
}


listen()


