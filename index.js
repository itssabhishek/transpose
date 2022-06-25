require('dotenv').config()
const express = require('express');
const axios = require('axios').default
const app = express();
const cors = require('cors');
const {json} = require('express');
const port = process.env.PORT || 3000;

//Include these two lines or express will screw you
app.use(cors());
app.use(express.json());

//Importing GoogleCSE module
app.use(require('./GoogleCSE'));

app.get('/', (req, res) => {
    res.send('Hello Transposers')
})

app.post('/sendsongname', async function (req, response) {
    const song_links = [];
    console.log(req.body.songname)
    console.log(req.body.platforms)
    chossen_platforms = req.body.platforms
    for (const platform of chossen_platforms) {
        const songLink = await sendRequest(platform, req.body.songname, song_links)
        const songOBJ = {
            platform: platform, link: songLink
        }
        song_links.push(songOBJ)

    }
    response.setHeader('Content-Type', 'application/json');
    response.send(song_links)
    console.log(song_links)
});


app.listen(port, () => {
    console.log(`Server is running on port: ${port}`);
});

function sendRequest(platform, songname, ar) {
    return axios.get(`https://transpose-app.herokuapp.com/search?q=${platform} ${songname}`).then(json => {
        return json.data.items[0].link
    }).catch(err => {
        console.log(err)
    });
}

