const launches = new Map()

const launch = {
    flightNumber: 100,
    date: new Date("December 27, 2030"),
    mission: "Kepler Exploration X",
    rocket: "Explorer IS1",
    destination: "Kepler-452 b",
    customer: ['NASA', 'NOAA'],
    upcoming: true,
    success: true
}

launches.set(launch.flightNumber, launch)

function getAllLaunches() {
    return Array.from(launches.values())
}


module.exports = {
    getAllLaunches
}