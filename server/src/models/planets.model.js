const { parse } = require('csv');
const fs = require('fs');
const path = require('path')
const planets = require('./planets.mongo')
const habitablePlanets = [];

function isHabitablePlanet(planet) {
    return planet['koi_disposition'] === 'CONFIRMED'
        && planet['koi_insol'] > 0.36 && planet['koi_insol'] < 1.11
        && planet['koi_prad'] < 1.6;
}

function loadPlanetData() {
    return new Promise((resolve, reject) => {
        fs.createReadStream(path.join(__dirname, "..", "..", "data", 'kepler_data.csv'))
            .pipe(parse({
                comment: "#",
                columns: true
            }))
            .on('data', async (data) => {
                if (isHabitablePlanet(data)) {
                    await savePlanets(data)
                }
            })
            .on('error', (err) => {
                reject(err)
            })
            .on('end', async () => {
                try {
                    const countHabitablePlanets = (await getAllPlanets()).length
                    console.log(`${countHabitablePlanets} habitable planets found!`);
                    resolve()
                } catch (e) {
                    console.error("Could not find planets", e)
                }
            });
    })
}

async function getAllPlanets() {
    try {
        return await planets.find({}, { "_id": 0, "__v": 0 })
    } catch (e) {
        console.error("Could not find planet data", e)
    }

}

async function savePlanets(planet) {
    try {
        await planets.updateOne({
            keplerName: planet.kepler_name
        }, {
            keplerName: planet.kepler_name
        }, {
            upsert: true
        })
    } catch (e) {
        console.error("Could not save planet", e)
    }
}

module.exports = {
    loadPlanetData,
    getAllPlanets
}
