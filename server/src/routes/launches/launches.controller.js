const { getAllLaunches, scheduleNewLaunch, abortByLaunchId, launchExists } = require('../../models/launches.model')
const { getPagination } = require("../../services/query")

async function httpGetAllLaunches(req, res) {
    const { limit, skip } = getPagination(req.query)
    const launches = await getAllLaunches(limit, skip)
    return res.status(200).json(launches)
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

async function httpAbortLaunch(req, res) {
    try {
        const exist = await launchExists(req.params.id)
        if (!exist) {
            return res.status(400).json({
                error: "Could not find launch with id " + req.params.id
            })
        }
        const aborted = await abortByLaunchId(req.params.id)
        if (!aborted) {
            return res.status(400).json({
                error: "Error aborting launch."
            })
        }
        return res.status(200).json({
            ok: true
        })
    } catch (e) {
        console.error("Error: ", e)
    }

}
module.exports = {
    httpGetAllLaunches,
    httpAddNewLaunch,
    httpAbortLaunch
}

