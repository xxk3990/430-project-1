"use strict";
const parseJSON = (xhr, content) => {
    if (xhr.response && xhr.getResponseHeader('Content-Type') === 'application/json') {
        const obj = JSON.parse(xhr.response);
        console.dir(obj);
        if (obj.message) {
            content.innerHTML += `<p>${obj.message}</p>`
        }
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
const addReviewToExistingMovie = (newReviewer, newReviewRating, newReviewField) => {
    const xhr = new XMLHttpRequest();
    xhr.open("POST", "/addReview");
    xhr.setRequestHeader('Accept', 'application/json');
    xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
    xhr.onload = () => handleReviewResponse(xhr);
    const newPercent = newReviewRating.value + '%';
    const formData = `newReviewer=${newReviewer.value}&newRating=${newPercent}&newReview=${newReviewField.value}`;
    xhr.send(formData);

    return false;
}

const handleReviewResponse = (xhr) => {
    const reviewObj = JSON.parse(xhr.response);
    console.dir(reviewObj);
    let lotrReviews = document.querySelector("#lotr-reviews");
    let fargoReviews = document.querySelector("#fargo-reviews");
    const newReviewContainer = document.createElement('div');
    newReviewContainer.setAttribute('class', 'movie-rating');
    newReviewContainer.innerHTML = `<h5 class = 'reviewer-name'>${reviewObj.newReviewer}</h5>
       <p>${reviewObj.newRating}</p><p class = 'movie-review'>${reviewObj.newReview}</p>`;
    // const rev1 = reviews[0];
    // const rev2 = reviews[1];
    lotrReviews.appendChild(newReviewContainer);
    fargoReviews.appendChild(newReviewContainer);
    // for (let i = 0; i <= reviews.length; i++) {
    //     if (i === 0) {
    //         rev1.append(newReviewContainer); //add div to review section
    //     } else {
    //         rev2.append(newReviewContainer);
    //     }
    // }

}

const handleResponse = (xhr, parseResponse) => {
    let content = document.querySelector('#content');
    switch (xhr.status) {
        case 200:
            content.innerHTML = '<b>Success!</b>';
            break;
        case 201:
            //if movie is created successfully then show the data!
            const obj = JSON.parse(xhr.response);
            console.dir(obj);
            content.setAttribute('class', 'movie-info');
            content.innerHTML =
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
            break;
        case 204:
            const updatedObj = JSON.parse(xhr.response);
            console.dir(updatedObj);
            //if movie is updated successfully then show the data!
            content.innerHTML =
                `<h3 class="movie-title"><em>${updatedObj.title}</em></h3>
            <h4 class="movie-plot-header">Plot:</h4>
            <p class="movie-plot">${updatedObj.plot}</p>
            <span class="movie-rating">
              <h4>Rating: ${updatedObj.rating}</h4>
            </span>
            <section id="reviews">
              <h4 class="movie-review-header">Reviews:</h4>
              <p class="movie-review">${updatedObj.review}</p>
            </section>
            <h3 class="trailer-link"><a target="_blank"
                href="${updatedObj.trailer}">Trailer</a></h3>`;

            break;
        case 400:
            content.innerHTML = '<b>Bad Request :-(</b>';
            break;
        case 404:
            content.innerHTML = '<b>Resource Not Found</b>';
            break;
        default:
            content.innerHTML = '<b>Error code not implemented by client :-()</b>';
            break;
    }
};

const setupAddReview = (addReviewForm, addReviewRating, addReviewRatingValue, addReviewField,
    submitReviewBtn, reviewerName) => {
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
        addReviewToExistingMovie(reviewerName, addReviewRating, addReviewField);
        addReviewForm.style.display = "none";
        addReviewField.value = ""; //clear textarea content
        addReviewRating.value = 0; //reset range value
        addReviewRatingValue.innerHTML = "0%"; //clear previous rating percent
    }
}


const init = () => {
  
    addMovieBtn.addEventListener('click', sendPostForNewMovie);
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
        // const movieTitle = document.querySelector(".movie-title");
        const newLotrRatingValue = document.querySelector("#lotr-new-rating-value");
        setupAddReview(lotrAddReviewForm, newLotrReviewRating, newLotrRatingValue, newLotrReviewField,
            submitNewLotrReview, lotrReviewer);
    }
    fargoAddReview.onclick = () => {
        const fargoAddReviewForm = document.querySelector("#fargo-add-review-form");
        const fargoSubmitReview = document.querySelector("#fargo-submit-review");
        const fargoNewReviewRating = document.querySelector("#fargo-new-review-rating");
        const newFargoReviewField = document.querySelector("#fargo-add-review-field");
        const fargoReviewer = document.querySelector("#fargo-new-reviewer");
        const fargoNewRatingValue = document.querySelector("#fargo-new-rating-value");
        setupAddReview(fargoAddReviewForm, fargoNewReviewRating, fargoNewRatingValue, newFargoReviewField,
            fargoSubmitReview, fargoReviewer);
    }



};

window.onload = init;