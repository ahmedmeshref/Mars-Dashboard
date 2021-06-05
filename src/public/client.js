const store = {
    currRover: 'Curiosity',
    roversImages: []
}

const root = document.getElementById('root');
const rovers = document.getElementsByClassName('btn');

const updateStore = (store, newState) => {
    store = Object.assign(store, newState);
    render(root, store);
}

const render = async (root, state) => {
    root.innerHTML = App(state);
}


// Populate the dom with 
// Launch Date rover.launch_date
// Landing Date rover.landing_date
// Status rover.status
// Most recently available photos img_src
// Date the most recent photos were taken earth_date

// create content
const App = (state) => {
    const { roversImages } = state;
    const htmlRovers = roversImages.map(roverInfo => formatRover(roverInfo)).join('');    
    return `
        <ul class='rover_lst'>
            ${htmlRovers}
        </ul>
    `;
}

const formatRover = (roverObj => {
    return `
        <li>
            <p>Launch Date: ${roverObj.rover.launch_date}</p>  
            <p>landing Date: ${roverObj.rover.landing_date}</p>  
            <p>Earth Date: ${roverObj.earth_date}</p>  
            <p>Status: ${roverObj.rover.status}</p> 
            <img class='rover_img' src='${roverObj.img_src}' alt='rover_img'> 
        </li>
    `
})

// listening for load event because page should load before any JS is called
window.addEventListener('load', () => {
    tabClick(Array.from(rovers), store);
    getRoverImages(store);
    render(root, store);
})

// listening for a click event on exisitng rover btns 
const tabClick = async (rovers, state) => {
    rovers.forEach(rover => {
        rover.addEventListener('click', async e => {
            const currRoverName = e.target.id;
            await updateActiveRover(rovers, currRoverName);
            await updateStore(state, { currRover: currRoverName });
            await getRoverImages(store);
        })
    });
}

const updateActiveRover = (rovers, currRoverName) => {
    // const oldActiveRover = document.getElementsByClassName('btn active');
    rovers.forEach(rover => {
        if (rover.id == currRoverName) {
            rover.classList.add('active');
        } else {
            rover.classList.remove('active');
        }
    })
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
        .then(roversInfo => {
            try {
                const roversImages = roversInfo['rover_info']['photos'];
                return updateStore(store, { roversImages });
            } catch (err) {
                console.log(err);
            }

        })
}




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