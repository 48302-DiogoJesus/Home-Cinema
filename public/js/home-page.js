const doc_watch_local = document.getElementById('watch-local')
const doc_watch_remote = document.getElementById('watch-remote')
const doc_movies_list = document.getElementsByTagName('li')
const doc_movies_input = document.getElementById('movie-id-input')
const doc_check_button = document.getElementById('check-con-button')
const doc_playpause_button = document.getElementById('play-pause-button')
const doc_volup_button = document.getElementById('volup-button')
const doc_voldown_button = document.getElementById('voldown-button')
const doc_fullscreen_button = document.getElementById('fullscreen-button')
const doc_back_button = document.getElementById('back-button')
const doc_forward_button = document.getElementById('forward-button')
const doc_close_button = document.getElementById('close-button')
const doc_desktop_button = document.getElementById('desktop-button')

// DISPLAY AVAILABLE MOVIES LIST
updateMoviesList()
clearInputField()

// GET AVAILABLE MOVIES ARRAY FROM SERVER
function updateMoviesList() {
    fetch('/movies', {method:'get'}).then((res) => {
        res.text().then((movies) => {
            moviesCallback(movies)
        })     
    })
}

// WRITE A LIST OF MOVIES TO THE DOC
function writeMovies(moviesList) {
    // CLEAR MOVIES LIST
    for (let i=0; i < 5;i++) {
        doc_movies_list[i].innerText = ''
    }
    var i = 0
    for (movie of moviesList) {
        doc_movies_list[i].innerText = movie
        i++
    }
}

// LISTENERS TO CALL THE API
doc_check_button.addEventListener('click', () => {
    fetch('/vp/check', {method:"get"}).then((res) => {
        if (res.status == 200) {
            alert('Connection Successful')
        } else {
            alert('Error Connecting')
        }
    })
})
doc_playpause_button.addEventListener('click', () => {
    fetch('/vp/playpause', {method:'get'})
})
doc_volup_button.addEventListener('click', () => {
    fetch('/vp/volup', {method:'get'})
})
doc_voldown_button.addEventListener('click', () => {
    fetch('/vp/voldown', {method:'get'})
})
doc_fullscreen_button.addEventListener('click', () => {
    fetch('/vp/fullscreen', {method:'get'})
})
doc_back_button.addEventListener('click', () => {
    fetch('/vp/back', {method:'get'})
})
doc_forward_button.addEventListener('click', () => {
    fetch('/vp/forward', {method:'get'})
})
doc_close_button.addEventListener('click', () => {
    fetch('/vp/close', {method:'get'})
})
doc_desktop_button.addEventListener('click', () => {
    fetch('/vp/desktop', {method:'get'})
})
doc_watch_local.addEventListener('click', () => {     
    var movieName = validateMovieChoice()
    if (movieName == false) return
    clearInputField()   
    // IF NO ERRORS
    fetch(`/movies/${movieName}`, {method:"get"}).then((res) => {
        if (res.status == 200) {
            window.location.href = `../../movies/${movieName}`
        } else {
            alert('The server could not find the movie you were looking for')
        }
    })
})
doc_watch_remote.addEventListener('click', () => {
    var movieName = validateMovieChoice()
    if (movieName == false) return
    fetch(`/vp/init/${movieName}`, {method:'get'})
})
function moviesCallback(movies) {
    let moviesFormatted = movies.replace('["','').replace('"]','').split('","')
    writeMovies(moviesFormatted)
}   

// CLEAR INPUT FIELD
function clearInputField() {
    doc_movies_input.value = ''
}

// VALIDATE THE USER INPUT
function validateMovieChoice() {
    let movieStr = doc_movies_input.value
    let movieId = parseInt(movieStr)

    if (movieStr == '') {
        alert('You need to select the movie first')
        return false
    }
    if (movieId < 1 || movieId > 5) {
        alert('The movie number can only be between 1 and 5')
        return false
    }

    let movieName = doc_movies_list[movieId-1].innerText
    
    if (movieName == '') {
        alert(`There is no movie with ID "${movieId}"`)
        return false
    }
    return movieName
}
