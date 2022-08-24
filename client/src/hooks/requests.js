const API_URL = 'v1'

async function httpGetPlanets() {
  // Load planets and return as JSON.
  try {
    const response = await fetch(`${API_URL}/planets`)
    return response.json()


  } catch (e) {

    console.log("Error fetching planets API " + e)
  }
}

async function httpGetLaunches() {
  // Load launches, sort by flight number, and return as JSON.
  try {
    const response = await fetch(`${API_URL}/launches`)
    const launches = await response.json()
    return launches.sort((a, b) => {
      return a.flightNumber - b.flightNumber
    })
  } catch (e) {
    console.log("Could not fetch launches " + e)
  }
}

async function httpSubmitLaunch(launch) {
  // Submit given launch data to launch system.
  try {
    return await fetch(`${API_URL}/launches`, {
      method: "post",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(launch)
    })
  } catch (err) {
    console.log("Could not post /launches", err)
    return {
      ok: false
    }

  }
}

async function httpAbortLaunch(id) {
  // Delete launch with given ID.
  try {
    return await fetch(`${API_URL}/launches/${id}`, {
      method: "delete",
    })
  } catch (err) {
    console.log("Cannot delete launch", err)
    return {
      ok: false
    }
  }
}

export {
  httpGetPlanets,
  httpGetLaunches,
  httpSubmitLaunch,
  httpAbortLaunch,
};