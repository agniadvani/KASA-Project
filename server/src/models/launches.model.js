const launches = new Map()

let latestFlightNumber = 100

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

launches.set(launch.flightNumber, launch)
function launchExists(id) {
    id = Number.parseInt(id)
    return launches.has(id)
}
function getAllLaunches() {
    return Array.from(launches.values())
}

function addNewLaunch(launch) {
    latestFlightNumber++
    launch.launchDate = new Date(launch.launchDate)
    const newLaunch = Object.assign(launch,
        {
            flightNumber: latestFlightNumber,
            customers: ['NASA', 'NOAA'],
            upcoming: true,
            success: true
        })
    launches.set(newLaunch.flightNumber, newLaunch)
    return newLaunch
}

function abortByLaunchId(launchId) {
    launchId = Number.parseInt(launchId)
    const abort = launches.get(launchId)
    abort.upcoming = false
    abort.success = false
    return abort
}

module.exports = {
    getAllLaunches,
    addNewLaunch,
    abortByLaunchId,
    launchExists
}