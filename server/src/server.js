const http = require('http')
const app = require('./app')
const { mongoConnect } = require("./services/mongo")
const { loadPlanetData } = require("./models/planets.model")

const PORT = process.env.PORT || 8000

const server = http.createServer(app)


async function listen() {
    try {
        await mongoConnect()
        await loadPlanetData()
    } catch (e) {
        console.error("Could not load planet data " + e)
    }
    server.listen(PORT, () => {
        console.log(`Listening on PORT: ${PORT}`);
    })
}


listen()


