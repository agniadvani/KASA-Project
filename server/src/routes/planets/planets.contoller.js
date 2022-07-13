const { getAllPlanets } = require('../../models/planets.model')

async function httpGetAllPlanets(req, res) {
    try {
        return await res.status(200).json(await getAllPlanets())
    } catch (e) {
        console.error("Could not get planets", e)
    }
}

module.exports = {
    httpGetAllPlanets
}