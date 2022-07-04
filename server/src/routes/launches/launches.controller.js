const { getAllLaunches, addNewLaunch, abortByLaunchId, launchExists } = require('../../models/launches.model')

function httpGetAllLaunches(req, res) {
    return res.status(200).json(getAllLaunches())
}

function httpAddNewLaunch(req, res) {

    if (!req.body.mission || !req.body.launchDate || !req.body.rocket || !req.body.target) {
        return res.status(400).json({ error: "Incomplete request body." })
    }
    if (isNaN(Date.parse(req.body.launchDate))) {
        return res.status(400).json({ error: "Invalid launchDate format." })
    }

    return res.status(201).json(addNewLaunch(req.body))

}

function httpAbortLaunch(req, res) {
    if (!launchExists(req.params.id)) {
        return res.status(400).json({
            message: "Could not find launch with id " + req.params.id
        })
    }
    const aborted = abortByLaunchId(req.params.id)
    return res.status(200).json(aborted)
}
module.exports = {
    httpGetAllLaunches,
    httpAddNewLaunch,
    httpAbortLaunch
}

