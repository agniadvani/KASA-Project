const launchDB = require("./launches.mongo")
const planets = require("./planets.mongo")
const launches = new Map()

const DEFAULT_FLIGHT_NUMBER = 100

const launch = {
    flightNumber: 100,
    launchDate: new Date("December 27, 2030"),
    mission: "ANIL1506",
    rocket: "Explorer IS1",
    target: "Kepler-452 b",
    customers: ['NASA', 'NOAA'],
    upcoming: true,
    success: true
}

saveLaunch(launch)

// launches.set(launch.flightNumber, launch)
async function launchExists(launchId) {
    try {
        return await launchDB.findOne({ flightNumber: launchId })
    } catch (e) {
        console.error("Error: ", e)
    }

}
async function getAllLaunches() {
    try {
        return await launchDB.find({}, { "_id": 0, "__v": 0 })
    } catch (e) {
        console.error("Could not find launches", e)
    }

}

async function scheduleNewLaunch(launch) {
    try {
        const latestFlightNumber = await getLatestFlightNumber() + 1

        launch.launchDate = new Date(launch.launchDate)
        const newLaunch = Object.assign(launch,
            {
                flightNumber: latestFlightNumber,
                customers: ['NASA', 'NOAA'],
                upcoming: true,
                success: true
            })
        await saveLaunch(newLaunch)
        return newLaunch
    } catch (e) {
        console.error("Could not add new launch", e)
    }
}

async function abortByLaunchId(launchId) {
    try {
        launchId = Number.parseInt(launchId)
        const aborted = await launchDB.updateOne({
            flightNumber: launchId
        }, {
            upcoming: false,
            success: false
        })
        return aborted.acknowledged === true && aborted.modifiedCount === 1
    } catch (e) {
        console.error("Error: ", e)
    }
}

async function saveLaunch(launch) {
    const planet = await planets.findOne({ keplerName: launch.target })

    if (!planet) {
        throw new Error("Planet does not exist in DB")
    }

    await launchDB.findOneAndUpdate({
        flightNumber: launch.flightNumber
    }, launch, { upsert: true })
}

async function getLatestFlightNumber() {
    const latestLaunch = await launchDB
        .findOne()
        .sort('-flightNumber');

    if (!latestLaunch) {
        return DEFAULT_FLIGHT_NUMBER
    }
    return latestLaunch.flightNumber
}

module.exports = {
    getAllLaunches,
    scheduleNewLaunch,
    abortByLaunchId,
    launchExists
}