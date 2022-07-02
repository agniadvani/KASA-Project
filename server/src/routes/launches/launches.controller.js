const { getAllLaunches, addNewLaunch } = require('../../models/launches.model')

function httpGetAllLaunches(req, res) {
    return res.status(200).json(getAllLaunches())
}

function httpAddNewLaunch(req, res) {

    if (!req.body.mission || !req.body.launchDate || !req.body.rocket || !req.body.destination) {
        return res.status(400).json({ error: "Incomplete request body." })
    }
    if (typeof (req.body.mission) !== "string" || typeof (req.body.rocket) !== "string" || typeof (req.body.destination) !== "string") {
        return res.status(400).json(JSON.stringify({ error: "Format for mission, rocket and destination must be string." }))
    }
    if (isNaN(Date.parse(req.body.launchDate))) {
        return res.status(400).json({ error: "Invalid launchDate format." })
    }
    if (new Date(req.body.launchDate) - new Date() < 0) {
        return res.status(400).json({ error: "Please enter a future date." })
    }

    return res.status(201).json(addNewLaunch(req.body))

}
module.exports = {
    httpGetAllLaunches,
    httpAddNewLaunch
}

