const launchesModel = require('../../models/launches.model')

function getAllLaunches(req, res) {
    res.status(200).json(Array.from(launchesModel.values()))
}

module.exports = {
    getAllLaunches
}

