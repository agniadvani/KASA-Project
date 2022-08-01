const axios = require("axios")
const launchDB = require("./launches.mongo")
const planets = require("./planets.mongo")

const DEFAULT_FLIGHT_NUMBER = 100
const SPACEX_URL = 'https://api.spacexdata.com/v4/launches/query'


// launches.set(launch.flightNumber, launch)
async function launchExists(launchId) {
    try {
        return await launchDB.findOne({ flightNumber: launchId })
    } catch (e) {
        console.error("Error: ", e)
    }

}
async function getAllLaunches(limit, skip) {
    try {

        return await launchDB
            .find({}, { "_id": 0, "__v": 0 })
            .sort({ flightNumber: 1 })
            .limit(limit)
            .skip(skip)
    } catch (e) {
        console.error("Could not find launches", e)
    }

}

async function scheduleNewLaunch(launch) {
    try {
        const planet = await planets.findOne({ keplerName: launch.target })

        if (!planet) {
            throw new Error("Planet does not exist in DB")
        }
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
    try {
        await launchDB.findOneAndUpdate({
            flightNumber: launch.flightNumber
        }, launch, { upsert: true })
    } catch (e) {
        console.error("Error at saveLaunch()", e)
    }

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
async function findLaunch(filter) {
    try {
        return await launchDB.findOne(filter)
    } catch (e) {
        console.error("Could not fetch launch data: ", e)
    }
}

async function populateLaunch() {
    try {
        console.log("Downlading launches data...")
        const response = await axios.post(SPACEX_URL, {

            query: {},
            options: {
                pagination: false,
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

        const launchDocs = response.data.docs

        for (const launchDoc of launchDocs) {
            const payload = launchDoc["payloads"]
            const customers = payload.flatMap((payload) => payload["customers"])
            const launch = {
                flightNumber: launchDoc["flight_number"],
                launchDate: launchDoc["date_local"],
                mission: launchDoc["name"],
                rocket: launchDoc["rocket"]["name"],
                upcoming: launchDoc["upcoming"],
                success: launchDoc["success"],
                customers
            }

            console.log(`${launch.flightNumber} ${launch.mission}`)
            saveLaunch(launch)
        }

    } catch (e) {
        console.log("Could not fetch space x data:", e)
    }
}

async function loadLaunchData() {
    try {
        const firstLaunch = await findLaunch({
            flightNumber: 1,
            rocket: "Falcon 1",
            mission: "FalconSat"
        })
        if (firstLaunch) {
            console.log("Launches already exist...")
        } else {
            populateLaunch()
        }

    } catch (e) {
        console.log("Error at launchData():", e)
    }

}


module.exports = {
    getAllLaunches,
    scheduleNewLaunch,
    abortByLaunchId,
    launchExists,
    loadLaunchData
}