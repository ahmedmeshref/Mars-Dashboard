require('dotenv').config()
const express = require('express');
const bodyParser = require('body-parser');
const Immutable = require('immutable');
const fetch = require('node-fetch');
const path = require('path');

const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.use('/', express.static(path.join(__dirname, '../public')))

/**
 * Get image data gathered by NASA's rovers 
 * @req : JSON object containes 'rover_name' and 'page' {optional} 
 * @res : JSOn object containes 25 pictures of the given rover
 */
app.post('/rover', async (req, res) => {
    try {
        console.log(req.body);
        const rover_name = req.body.rover_name.toLowerCase();
        const page = req.body.page || 1;
        const rover_info = await fetch(`https://api.nasa.gov/mars-photos/api/v1/rovers/${rover_name}/photos?sol=1000&page=${page}&api_key=${process.env.API_KEY}`)
            .then(res => res.json())
        res.send({ rover_info })
    } catch (err) {
        console.log('error:', err);
    }
})


app.listen(port, () => console.log(`Example app listening on port ${port}!`));