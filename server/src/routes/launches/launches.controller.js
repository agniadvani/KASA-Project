const { getAllLaunches, scheduleNewLaunch, abortByLaunchId, launchExists } = require('../../models/launches.model')

async function httpGetAllLaunches(req, res) {
    return res.status(200).json(await getAllLaunches())
}

async function httpAddNewLaunch(req, res) {

    if (!req.body.mission || !req.body.launchDate || !req.body.rocket || !req.body.target) {
        return res.status(400).json({ error: "Incomplete request body." })
    }
    if (isNaN(Date.parse(req.body.launchDate))) {
        return res.status(400).json({ error: "Invalid launchDate format." })
    }
    try {
        const response = await scheduleNewLaunch(req.body)
        return res.status(201).json(response)
    } catch (e) {
        return res.status(400).json({ error: e })
    }


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

