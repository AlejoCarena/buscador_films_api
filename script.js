const movieSearchBox = document.getElementById('movie-search-box');
const searchList = document.getElementById('search-list')
const resultGrid = document.getElementById('result-grid')

async function loadMovies(searchTerm){
    const URL = `https://api.themoviedb.org/3/search/movie?query=${searchTerm}&api_key=59bf75daae812ea1dcfed90bef35be65`;
    const res = await fetch (`${URL}`);
    const data = await res.json();
    if(Array.isArray(data.results) && data.results.length > 0) displayMovieList(data.results)
}
function findMovies(){
    let searchTerm = (movieSearchBox.value).trim()
    if(searchTerm.length>0){
        searchList.classList.remove('hide-search-list')
        loadMovies(searchTerm)
    }else{
        searchList.classList.add('hide-search-list')
    }
}

function displayMovieList(movies){
    searchList.innerHTML = "";
    for(let idx = 0; idx < movies.length; idx++)
    {
        let movieListItem = document.createElement('div');
        movieListItem.dataset.id = movies[idx].id;
        movieListItem.classList.add('search-list-item')
        if(movies[idx].poster_path != null){
            moviePoster =`https://image.tmdb.org/t/p/w200${movies[idx].poster_path}`
        }else{
            moviePoster = "imagenotfound.jpg"
        }
        movieListItem.innerHTML=`
        <div class = "search-item-thumbnail">
            <img src = "${moviePoster}">
        </div>
        <div class = "search-item-info">
            <h3>${movies[idx].title}</h3>
            <p>${movies[idx].release_date}</p>
        </div>
        `
        searchList.appendChild(movieListItem)
    }
    loadMoviesDetails()
}

function loadMoviesDetails(){
    const searchListMovies = searchList.querySelectorAll('.search-list-item')
    searchListMovies.forEach(movie => {
        movie.addEventListener('click', async()=>{
            searchList.classList.add('hide-search-list')
            movieSearchBox.value="";
            const result=await fetch(`https://api.themoviedb.org/3/movie/${movie.dataset.id}?api_key=59bf75daae812ea1dcfed90bef35be65`)
            const movieDetails = await result.json()
            const result1=await fetch(`https://api.themoviedb.org/3/movie/${movie.dataset.id}/credits?api_key=59bf75daae812ea1dcfed90bef35be65`)
            const movieDetails1 = await result1.json()
            displayMovieDetails(movieDetails,movieDetails1)

        })
    })
}
function limpiar(){
    resultGrid.innerHTML=""
}

function displayMovieDetails(movieDetails, movieDetails1) {
    // Géneros
    const genres = movieDetails.genres.map(genre => genre.name).join(', ');

    // Escritores
    const writers = movieDetails1.crew.filter(member => member.job === 'Screenplay' || member.job === 'Writer')
    .map(writer => writer.name)
    .join(', ');

    // Actores
    const actors = movieDetails1.cast.slice(0, 3).map(actor => actor.name).join(', ');

    // Mostrar los detalles de la película
    resultGrid.innerHTML = `
        <div class="movie-poster">
            <img src="${(movieDetails.backdrop_path != null) ? `https://image.tmdb.org/t/p/w500${movieDetails.poster_path}` : "imagenotfound.jpg"}" alt="movie poster">
        </div>
        <div class="movie-info">
            <h3 class="movie-title">${movieDetails.original_title}</h3>
            <ul class="movie-misc-info">
                <li class="year">Released: ${movieDetails.release_date}</li>
                <li class="rated">Ratings: ${movieDetails.vote_average}</li>
                <li class="released">${movieDetails.vote_count} votes</li>
            </ul>
            <p class="genre"><b>Genre:</b> ${genres}</p>
            <p class="writer"><b>Writer:</b> ${writers}</p>
            <p class="actors"><b>Actors:</b> ${actors}</p>
            <p class="plot"><b>Plot:</b> ${movieDetails.overview}</p>
            <p class="language"><b>Language:</b> ${movieDetails.original_language}</p>
            <a href="${movieDetails.homepage}" target="_blank" class="awards"><b>Homepage</a>
        </div>`;
}
