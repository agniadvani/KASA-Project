const request = require("supertest")
const app = require('../../app')
const { mongoConnect, mongoDisconnect } = require("../../services/mongo")
const { loadPlanetData } = require("../../models/planets.model")
describe('Laubches API', () => {
    beforeAll(async () => {
        try {
            await mongoConnect()
            await loadPlanetData()
        } catch (e) {
            console.log("Could not connect to mongoDB", e)
        }
    })

    afterAll(async () => {
        try {
            await mongoDisconnect()
        } catch (e) {
            console.log("Error disconnecting mongoose", e)
        }
    })
    describe('Test GET /launches', () => {
        test('It should respond with 200 success', async () => {
            await request(app)
                .get("/v1/launches")
                .expect("Content-Type", /json/)
                .expect(200)
        })
    })

    describe('Test POST /launches', () => {
        const launchDataWithDate = {
            launchDate: "December 27, 2030",
            mission: "ANIL1506",
            rocket: "Explorer IS1",
            target: "Kepler-452 b",
        }
        const launchDataWithoutDate = {
            mission: "ANIL1506",
            rocket: "Explorer IS1",
            target: "Kepler-452 b",
        }
        test('It should respond with 200 success', async () => {
            const response = await request(app)
                .post("/v1/launches")
                .send(launchDataWithDate)
                .expect("Content-Type", /json/)
                .expect(201)
            let requestDate = new Date(launchDataWithDate.launchDate).valueOf()
            let responseDate = new Date(response.body.launchDate).valueOf()
            expect(response.body).toMatchObject(launchDataWithoutDate)
            expect(requestDate).toBe(responseDate)
        })
        test('It should respond with 400 "Incomplete request body"', async () => {
            const response = await request(app)
                .post("/v1/launches")
                .send(launchDataWithoutDate)
                .expect(400)

            expect(response.body).toStrictEqual({ error: "Incomplete request body." })
        })
        test('It should respond with 400 "Invalid date format"', async () => {
            const response = await request(app)
                .post("/v1/launches")
                .send({
                    launchDate: "Decdsflkdfsjl",
                    mission: "ANIL1506",
                    rocket: "Explorer IS1",
                    target: "Kepler-452 b",
                })
                .expect(400)

            expect(response.body).toStrictEqual({ error: "Invalid launchDate format." })
        })
    })
})
