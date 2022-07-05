const request = require("supertest")
const app = require('../../app')
describe('Test GET /launches', () => {
    test('It should respond with 200 success', async () => {
        await request(app)
            .get("/launches")
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
            .post("/launches")
            .send(launchDataWithDate)
            .expect("Content-Type", /json/)
            .expect(201)
        let requestDate = new Date(launchDataWithDate.launchDate).valueOf()
        let responseDate = new Date(response.body.launchDate).valueOf()
        expect(response.body).toMatchObject(launchDataWithoutDate)
        expect(requestDate).toBe(responseDate)
    })
    test('It should respond with 400 "Incomplete request body"', () => { })
    test('It should respond with 400 "Incomplete date format"', () => { })
})