const launches = new Map()

let latestFlightNumber = 100

const launch = {
    flightNumber: 100,
    launchDate: new Date("December 27, 2030"),
    mission: "ANIL1506",
    rocket: "Explorer IS1",
    target: "Kepler-452 b",
    customer: ['NASA', 'NOAA'],
    upcoming: true,
    success: true
}

launches.set(launch.flightNumber, launch)

function getAllLaunches() {
    return Array.from(launches.values())
}

function addNewLaunch(launch) {
    latestFlightNumber++
    launch.launchDate = new Date(launch.launchDate)
    const newLaunch = Object.assign(launch,
        {
            flightNumber: latestFlightNumber,
            customer: ['NASA', 'NOAA'],
            upcoming: true,
            success: true
        })
    launches.set(newLaunch.flightNumber, newLaunch)
    return newLaunch
}

module.exports = {
    getAllLaunches,
    addNewLaunch
}