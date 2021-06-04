const store = {
    currRover: 'Curiosity',
    roverImages: []
}

// add our markup to the page
const root = document.getElementById('root');

const updateStore = (store, newState) => {
    store = Object.assign(store, newState);
    render(root, store);
}

const render = async (root, state) => {
    root.innerHTML = App(state);
}


// create content
const App = (state) => {
    let { rovers, apod } = state

    return `
    `
}

// listening for load event because page should load before any JS is called
window.addEventListener('load', () => {
    // render(root, store);
    getRoverImages(store);
})

// ------------------------------------------------------  COMPONENTS


// Example of a pure function that renders infomation requested from the backend
const ImageOfTheDay = (apod) => {

    // If image does not already exist, or it is not from today -- request it again
    const today = new Date();
    const photodate = new Date(apod.date);
    console.log(photodate.getDate(), today.getDate());

    console.log(photodate.getDate() === today.getDate());
    if (!apod || apod.date === today.getDate()) {
        getImageOfTheDay(store)
    }

    // check if the photo of the day is actually type video!
    if (apod.media_type === "video") {
        return (`
            <p>See today's featured video <a href="${apod.url}">here</a></p>
            <p>${apod.title}</p>
            <p>${apod.explanation}</p>
        `)
    } else {
        return (`
            <img src="${apod.image.url}" height="350px" width="100%" />
            <p>${apod.image.explanation}</p>
        `)
    }
}

// ------------------------------------------------------  API CALLS

// Get Rover Images API call
const getRoverImages = (state) => {
    const rover_name = state.currRover;

    fetch(`http://localhost:3000/rover`, {
        method: 'POST',
        headers: {
            "content-type": 'application/json'
        },
        body: JSON.stringify({
            rover_name: rover_name
        })
    })
        .then(res => res.json())
        // .then(roverInfo => updateStore(store, { roverInfo["rover_info"]["photos"] }))
        .then(roverInfo => console.log(roverInfo['rover_info']['photos']))

    return rover_name;
}


// Populate the dom with 
// Launch Date
// Landing Date
// Status
// Most recently available photos
// Date the most recent photos were taken

/*
{
"rover_info": {
    "photos": [
        {
        "id": 102693,
        "sol": 1000,
        "camera": {
            "id": 20,
            "name": "FHAZ",
            "rover_id": 5,
            "full_name": "Front Hazard Avoidance Camera"
        },
        "img_src": "http://mars.jpl.nasa.gov/msl-raw-images/proj/msl/redops/ods/surface/sol/01000/opgs/edr/fcam/FLB_486265257EDR_F0481570FHAZ00323M_.JPG",
        "earth_date": "2015-05-30",
        "rover": {
            "id": 5,
            "name": "Curiosity",
            "landing_date": "2012-08-06",
            "launch_date": "2011-11-26",
            "status": "active"
            }
        },
    }
}
*/