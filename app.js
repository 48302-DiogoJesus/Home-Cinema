// REQUIRES VLC PLAYER INSTALLED IN 'C:\\Program Files\\VideoLAN\\VLC'
const robot    = require("robotjs")
const sound    = require('loudness')
const file     = require('fs')
const { exec } = require('child_process')
const express  = require('express')
const app = express()

const PORT = process.argv[2] || 3000

const movdir = process.env[(process.platform == 'win32') ? 'USERPROFILE' : 'HOME'] + "\\AppData\\Roaming\\Movies\\"

// INCLUDE ALL STATIC FILES
app.use(express.static(__dirname + '/public'))
app.use(express.static(__dirname + '/views'))
app.use('/css', express.static(__dirname + 'public/css'))
app.use('/js', express.static(__dirname + 'public/js'))
app.use('/img', express.static(__dirname + 'public/img'))

// SET LISTENER
app.listen(PORT)
if (process.argv.length == 2) console.log('You can specify a port by passing it as argument to the executable')
console.log(`\nListening on port ${PORT}\n`)

if (!file.existsSync("C:\\Program Files\\VideoLAN\\VLC\\vlc.exe")) {console.log('You need to install VLC Player!\n');process.exit(0)}
if (!file.existsSync(movdir)) {
    file.mkdirSync(movdir) 
}
if (file.readdirSync(movdir).length === 0) {
    console.log(`Make sure the movies are inside "${movdir}"\n`)
}

// VLC IS ENVIRONMENT VARIABLE
exec('set PATH=%PATH%;C:\\Program Files\\VideoLAN\\VLC')

// API SETUP
// SERVE HOME PAGE
app.get('/', (req, res) => {
    res.sendFile(__dirname + "/views/home-page.html")
})
app.get('/movies', (req, res) => {
    res.status(200).send(getMovies())
})
app.get('/movies/:moviename', (req, res) => {
    let moviePath = movdir + req.params.moviename
    if (file.existsSync(moviePath)) {
        res.status(200).sendFile(moviePath)
    } else {
        res.status(404).send()
    }
})
// VIDEO PLAYER WEB API
app.get('/vp/check', (req, res) => {
    res.status(200).send()
    res.send()
})
// PLAY / PAUSE
app.get('/vp/playpause', (req, res) => {
    robot.keyTap('space') 
    res.send()                
})
// VOLUME UP
app.get('/vp/volup', (req, res) => {
    changeVol(true)
    res.send()
})
// VOLUME DOWN
app.get('/vp/voldown', (req, res) => {
    changeVol(false)
    res.send()
})
app.get('/vp/fullscreen', (req, res) => {
    robot.keyTap('f')
    res.send()
})
// GOING FORWARD OR BACKWARDS IN VIDEO
app.get('/vp/back', (req, res) => {
    robot.keyTap('left')
    res.send()
})
app.get('/vp/forward', (req, res) => {
    robot.keyTap('right')
    res.send()
})
// CLOSE VLC PLAYER
app.get('/vp/close', (req, res) => {
    robot.keyToggle('control', 'down')
    robot.keyToggle('q', 'down')
    robot.keyToggle('control','up')
    robot.keyToggle('q', 'up')
    res.send()
})
app.get('/vp/desktop', (req, res) => {
    robot.keyToggle('command', 'down')
    robot.keyToggle('d', 'down')
    robot.keyToggle('command','up')
    robot.keyToggle('d', 'up')
    res.send()
})
// OPEN REQUIRED MOVIE USING VLC
app.get('/vp/init/:movie_name', (req, res) => {
    let moviePath = movdir + req.params.movie_name
    if (file.existsSync(moviePath)) {
        let command = 'vlc \"' + moviePath + "\""
        exec(command, (err) => {
            if (err) console.log(err.message)
        })
    }
    res.send()
})


// GET LIST OF AVAILABLE MOVIES FROM THE MOVIES FOLDER
function getMovies() {
    let moviesList = []
    let movies = file.readdirSync(movdir)
    for (movie of movies) {
        moviesList.push(movie)
    }
    return movies
}

const VOLUME_INCREMENT = 10;
async function changeVol(up) {
    var currVol = await sound.getVolume() 

    if (up && currVol + VOLUME_INCREMENT <= 100) {
        sound.setMuted(false)
        sound.setVolume(currVol + VOLUME_INCREMENT)
    } else if (!up && currVol - VOLUME_INCREMENT >= 0) {
        if (currVol - VOLUME_INCREMENT == 0) {
            sound.setMuted(true) 
        } else {
            sound.setMuted(false)
        }
        sound.setVolume(currVol - VOLUME_INCREMENT)
    }
}