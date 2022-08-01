const mongoose = require('mongoose')
const DB_URL = process.env.MONGO_URL


async function mongoConnect() {
    try {
        mongoose.connection
            .once("open", () => {
                console.log("Db connected")
            })
            .on('error', (err) => {
                console.error(err)
            })

        await mongoose.connect(DB_URL)
    } catch (e) {
        console.log("Could not connect to Database", e)
    }
}

async function mongoDisconnect() {
    try {
        mongoose.disconnect()
    } catch (e) {
        console.log("Error disconnecting mongoose", e)
    }
}

module.exports = {
    mongoConnect,
    mongoDisconnect
}