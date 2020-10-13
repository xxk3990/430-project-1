"use strict";
const parseDefaultData = (xhr) => {
    let allMovies = document.querySelector("#movies"); //get container element that has all movies
    const obj = JSON.parse(xhr.response);
    for (const mov of Object.keys(obj.movies)) {
        let defaultContent = document.createElement('section'); //create content section for each added movie
        defaultContent.setAttribute('class', 'movie-info'); //add class for css
        defaultContent.setAttribute('id', 'content'); //add id for css
        console.dir(obj);
        defaultContent.innerHTML = '';
        defaultContent.innerHTML +=
            `<h3 class="movie-title"><em>${obj.movies[mov].title}</em></h3>
        <h4 class="movie-plot-header">Plot:</h4>
        <p class="movie-plot">${obj.movies[mov].plot}</p>
        <section id="reviews">
        <h4 class="movie-review-header">Reviews:</h4>
        <div class="movie-rating">
        <h5 class = 'reviewer-name'>${obj.movies[mov].review.reviewer_name}</h5>
        <p>Rating: ${obj.movies[mov].review.rating}</p>
        <p class="movie-review">${obj.movies[mov].review.review}</p>
        </div> 
        </section>
        <h3 class="trailer-link"><a target="_blank"
        href="${obj.movies[mov].trailer}">Trailer</a></h3>`;
        allMovies.appendChild(defaultContent); //add section to end of all movies
        break;
    }
};
const sendPostForNewMovie = () => {
    const titleField = document.querySelector('#titleField');
    const ratingSelect = document.querySelector('#star-rating');
    const reviewField = document.querySelector("#reviewField");
    const plotField = document.querySelector("#plotField");
    const trailerField = document.querySelector("#trailerLink");
    const nameField = document.querySelector("#nameField");
    let starRating = ratingSelect[ratingSelect.selectedIndex].value;
    const parsedRating = parseFloat(starRating);
    const xhr = new XMLHttpRequest();
    xhr.open("POST", "/addMovie");
    xhr.setRequestHeader('Accept', 'application/json');
    xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
    xhr.onload = () => handleResponse(xhr);
    const formData = `title=${titleField.value}&plot=${plotField.value}&reviewer_name=${nameField.value}&rating=${parsedRating}&review=${reviewField.value}&trailer=${trailerField.value}`;
    xhr.send(formData);


    return false;
};
// const clearForm = () => {
//     const titleField = document.querySelector('#titleField');
//     const ratingRange = document.querySelector('#ratingRange');
//     const reviewField = document.querySelector("#reviewField");
//     const plotField = document.querySelector("#plotField");
//     const trailerField = document.querySelector("#trailerLink");
//     const nameField = document.querySelector("#nameField");
//     const ratingText = document.querySelector("#ratingValue");

//     titleField.value = ""
//     ratingRange.value = 0;
//     ratingText.innerHTML = ratingRange.value + '%';
//     plotField.value = ""
//     reviewField.value = "";
//     trailerField.value = "";
//     nameField.value = "";
// }
// const getMovies = (message) => {
//     const xhr = new XMLHttpRequest();
//     xhr.open("GET", "/getMovies");
//     xhr.onload = () => {
//         parseJSON(xhr, message);
//     }
// }
const loadData = (xhr, showData) => {
    let allMovies = document.querySelector("#movies"); //get container element that has all movies

    if (showData) {
        const data = JSON.parse(xhr.response);
        for (const mov of Object.keys(data.movies)) {
            let content = document.createElement('section'); //create content section for each added movie
            content.setAttribute('class', 'movie-info'); //add class for css
            content.setAttribute('id', 'content'); //add id for css
            content.innerHTML = '';
            content.innerHTML +=
                `<h3 class="movie-title"><em>${data.movies[mov].title}</em></h3>
                <h4 class="movie-plot-header">Plot:</h4>
                <p class="movie-plot">${data.movies[mov].plot}</p>
                <section id="reviews">
                <h4 class="movie-review-header">Reviews:</h4>
                <div class="movie-rating">
                <h5 class = 'reviewer-name'>${data.movies[mov].review.reviewer_name}</h5>
                <p>Rating: ${data.movies[mov].review.rating} star(s)</p>
                <p class="movie-review">${data.movies[mov].review.review}</p>
                </div> 
                </section>
                <h3 class="trailer-link"><a target="_blank"
                href="${data.movies[mov].trailer}">Trailer</a></h3>`;
            allMovies.appendChild(content);

        }
    } else {
        console.log(xhr.response);
    }

}
const getAllMovies = () => {
    const xhr = new XMLHttpRequest();
    xhr.open('GET', '/getMovies');
    xhr.setRequestHeader('Accept', 'application/json');
    xhr.onload = () => loadData(xhr, true);
    xhr.send();
}
const headRequest = () => {
    const xhr = new XMLHttpRequest();
    xhr.open('HEAD', '/getMovies');
    xhr.onload = () => loadData(xhr, false);
    xhr.send();
}
const handleResponse = (xhr) => {
    let message = document.querySelector("#message");
    let showAllBtn = document.querySelector("#showAllBtn");
    message.style.visibility = 'visible';
    switch (xhr.status) {
        case 200:
            message.innerHTML = 'Success!'
            // showAllBtn.setAttribute('disabled', true);
            break;
        case 201:
            message.innerHTML = 'created!';
            // loadData(xhr, true);
            break;
        case 204:
            message.innerHTML = 'Updated, but no content!'
            movies.style.visibility = 'hidden';

            break;
        case 400:
            message.innerHTML = '<b>Bad Request :-(</b> \n';
            break;
        case 404:
            message.innerHTML = '<b>Resource Not Found</b>';
            break;
        default:
            message.innerHTML = '<b>Error code not implemented by client :-()</b>';
            break;
    }

    showAllBtn.onclick = () => {
        getAllMovies();
        headRequest();
    }

}

const init = () => {
    addMovieBtn.onclick = () => {
        sendPostForNewMovie();
    }
};

window.onload = init;