const axios = require("axios")
const launchDB = require("./launches.mongo")
const planets = require("./planets.mongo")

const DEFAULT_FLIGHT_NUMBER = 100
const SPACEX_URL = 'https://api.spacexdata.com/v4/launches/query'
const launch = {
    flightNumber: 100, //flight_number
    launchDate: new Date("December 27, 2030"), //date_local
    mission: "ANIL1506", //name
    rocket: "Explorer IS1", //rocket.name
    target: "Kepler-452 b", //not applicable
    customers: ['NASA', 'NOAA'], //payloads.customers
    upcoming: true, //upcoming
    success: true //success
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

async function loadLaunchData() {
    console.log("Downlading launches data...")

    const response = axios.post(SPACEX_URL, {

        query: {},
        options: {
            populate: [
                {
                    path: "rocket",
                    select: {
                        name: 1
                    }
                },
                {
                    path: "payloads",
                    select: {
                        customers: 1
                    }
                }
            ]
        }

    })
}
module.exports = {
    getAllLaunches,
    scheduleNewLaunch,
    abortByLaunchId,
    launchExists,
    loadLaunchData
}