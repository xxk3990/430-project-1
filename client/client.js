"use strict";
const parseJSON = (xhr, message) => {
    let allMovies = document.querySelector("#movies"); //get container element that has all movies
    let content = document.createElement('section'); //create content section for each added movie
    content.setAttribute('class', 'movie-info'); //add class for css
    content.setAttribute('id', 'content'); //add id for css
    if (xhr.response && xhr.getResponseHeader('Content-Type') === 'application/json') {
        const obj = JSON.parse(xhr.response);
        console.dir(obj);
        message.style.visibility = 'hidden'; //hide status messages!
        console.dir(obj);
        content.innerHTML +=
            `<h3 class="movie-title"><em>${obj.title}</em></h3>
        <h4 class="movie-plot-header">Plot:</h4>
        <p class="movie-plot">${obj.plot}</p>
        <section id="reviews">
        <h4 class="movie-review-header">Reviews:</h4>
        <div class="movie-rating">
        <h5 class = 'reviewer-name'>${obj.name}</h5>
        <p>Rating: ${obj.rating}</p>
        <p class="movie-review">${obj.review}</p>
        </div> 
        </section>
        <h3 class="trailer-link"><a target="_blank"
        href="${obj.trailer}">Trailer</a></h3>`;
        // <button type="button" class="add-review">Add Review</button>
        // <textarea class="add-review-field"></textarea>
        // <input type="range" class="new-review-rating" value="0" min="0" max="100" step="1">
        // <p class="new-rating-value">0%</p>
        // <button type="button" class="submit-new-review">Submit Review</button>
        allMovies.appendChild(content); //add section to end of all movies

    }
};
const sendPostForNewMovie = () => {
    const titleField = document.querySelector('#titleField');
    const ratingRange = document.querySelector('#ratingRange');
    const reviewField = document.querySelector("#reviewField");
    const plotField = document.querySelector("#plotField");
    const trailerField = document.querySelector("#trailerLink");
    const nameField = document.querySelector("#nameField");

    const xhr = new XMLHttpRequest();
    xhr.open("POST", "/addMovie");
    xhr.setRequestHeader('Accept', 'application/json');
    xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
    xhr.onload = () => handleResponse(xhr);
    const ratingPercent = ratingRange.value + '%';

    const formData = `title=${titleField.value}&plot=${plotField.value}&name=${nameField.value}&rating=${ratingPercent}&review=${reviewField.value}&trailer=${trailerField.value}`;
    xhr.send(formData);

    return false;
};
const addReviewToExistingMovie = (newReviewer, newReviewRating, newReviewField, movieTitle) => {
    const xhr = new XMLHttpRequest();
    xhr.open("POST", "/addReview");
    xhr.setRequestHeader('Accept', 'application/json');
    xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
    xhr.onload = () => handleReviewResponse(xhr);
    const newPercent = newReviewRating.value + '%';
    const formData = `movieTitle=${movieTitle}&newReviewer=${newReviewer.value}&newRating=${newPercent}&newReview=${newReviewField.value}`;
    xhr.send(formData);

    return false;
}

const handleReviewResponse = (xhr) => {
    const reviewObj = JSON.parse(xhr.response);
    console.dir(reviewObj);
    let lotrReviews = document.querySelector("#lotr-reviews");
    let fargoReviews = document.querySelector("#fargo-reviews");
    if (reviewObj.movieTitle == "Fargo") { //if movie title is "Fargo", only append to "Fargo" section
        const fargoReviewContainer = document.createElement('div');
        fargoReviewContainer.setAttribute('class', 'movie-rating');
        fargoReviewContainer.innerHTML = `<h5 class = 'reviewer-name'>${reviewObj.newReviewer}</h5>
        <p>${reviewObj.newRating}</p><p class = 'movie-review'>${reviewObj.newReview}</p>`;
        fargoReviews.appendChild(fargoReviewContainer);
    } else { //for now this will automatically mean lotr, but in future will make it work for all films
        const lotrReviewContainer = document.createElement('div');
        lotrReviewContainer.setAttribute('class', 'movie-rating');
        lotrReviewContainer.innerHTML = `<h5 class = 'reviewer-name'>${reviewObj.newReviewer}</h5>
        <p>${reviewObj.newRating}</p><p class = 'movie-review'>${reviewObj.newReview}</p>`;
        lotrReviews.appendChild(lotrReviewContainer);
    }

}
const clearForm = () => {
    const titleField = document.querySelector('#titleField');
    const ratingRange = document.querySelector('#ratingRange');
    const reviewField = document.querySelector("#reviewField");
    const plotField = document.querySelector("#plotField");
    const trailerField = document.querySelector("#trailerLink");
    const nameField = document.querySelector("#nameField");
    const ratingText = document.querySelector("#ratingValue");

    titleField.value = ""
    ratingRange.value = 0;
    ratingText.innerHTML = ratingRange.value + '%';
    plotField.value = ""
    reviewField.value = "";
    trailerField.value = "";
    nameField.value = "";
}
const handleResponse = (xhr) => {
    let message = document.querySelector("#message");
    let showAllBtn = document.querySelector("#showAllBtn");
    message.style.visibility = 'visible';
    switch (xhr.status) {
        case 200:
            message.innerHTML = 'Success!'
            break;
        case 201:
            message.innerHTML = 'Created!';
            parseJSON(xhr, message);
            break;
        case 204:
            message.innerHTML = 'Updated, but no content!'
            movies.style.visibility = 'hidden';
            showAllBtn.onclick = () => {
                parseJSON(xhr, message);
            }
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
        lotrInfo.style.visibility = 'visible';
        fargoInfo.style.visibility = 'visible';
        clearForm();
    }

};
const setupAddReview = (addReviewForm, addReviewRating, addReviewRatingValue, addReviewField,
    submitReviewBtn, reviewerName, movieTitle) => {
    addReviewForm.style.display = "block";
    addReviewRating.oninput = (e) => {
        addReviewRatingValue.innerHTML = e.target.value + "%";
    }
    addReviewField.oninput = () => {
        submitReviewBtn.removeAttribute('disabled');
    }
    addReviewField.onkeyup = () => {
        //checks if textarea is empty
        if (addReviewField.value.length == 0) {
            submitReviewBtn.setAttribute('disabled', true);
        }

    }
    submitReviewBtn.onclick = () => {
        addReviewToExistingMovie(reviewerName, addReviewRating, addReviewField, movieTitle);
        addReviewForm.style.display = "none";
        addReviewField.value = ""; //clear textarea content
        addReviewRating.value = 0; //reset range value
        addReviewRatingValue.innerHTML = "0%"; //clear previous rating percent
        reviewerName.value = ""; //remove reviewer's name
    }
}

const init = () => {
    addMovieBtn.onclick = () => {
        sendPostForNewMovie();
        clearForm();
    }
    showAllBtn.onclick = () => {
        lotrInfo.style.visibility = 'visible';
        fargoInfo.style.visibility = 'visible';
    }
    const ratingText = document.querySelector("#ratingValue");
    const range = document.querySelector("#ratingRange");
    range.oninput = (e) => {
        ratingText.innerHTML = e.target.value + "%";
    }
    const lotrAddReview = document.querySelector("#lotr-add-review"); //add review button
    const fargoAddReview = document.querySelector("#fargo-add-review");
    lotrAddReview.onclick = () => {
        const lotrAddReviewForm = document.querySelector("#lotr-add-review-form"); //section
        const submitNewLotrReview = document.querySelector("#lotr-submit-review"); //submit review button
        const newLotrReviewRating = document.querySelector("#lotr-new-review-rating");
        const newLotrReviewField = document.querySelector("#lotr-add-review-field"); //textarea
        const lotrReviewer = document.querySelector("#lotr-new-reviewer");
        const lotrTitle = document.querySelector("#lotr-movie-title em"); //gets italics tag inside movie title
        const newLotrRatingValue = document.querySelector("#lotr-new-rating-value");
        setupAddReview(lotrAddReviewForm, newLotrReviewRating, newLotrRatingValue, newLotrReviewField,
            submitNewLotrReview, lotrReviewer, lotrTitle.innerHTML); //had to add title innerHTML as a param for it to work
    }
    fargoAddReview.onclick = () => {
        const fargoAddReviewForm = document.querySelector("#fargo-add-review-form");
        const fargoSubmitReview = document.querySelector("#fargo-submit-review");
        const fargoNewReviewRating = document.querySelector("#fargo-new-review-rating");
        const newFargoReviewField = document.querySelector("#fargo-add-review-field");
        const fargoReviewer = document.querySelector("#fargo-new-reviewer");
        const fargoTitle = document.querySelector("#fargo-movie-title em");
        const fargoNewRatingValue = document.querySelector("#fargo-new-rating-value");
        setupAddReview(fargoAddReviewForm, fargoNewReviewRating, fargoNewRatingValue, newFargoReviewField,
            fargoSubmitReview, fargoReviewer, fargoTitle.innerHTML);
    }



};

window.onload = init;