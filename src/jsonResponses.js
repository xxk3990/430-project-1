// Note this object is purely in memory
const movies = {};
const reviews = {};
const {v4: uuidv4} = require('uuid'); //import uuid version 4, v4 creates random uuids

const respondJSON = (request, response, status, object) => {
  const headers = {
    'Content-Type': 'application/json',
  };

  response.writeHead(status, headers);
  response.write(JSON.stringify(object));
  response.end();
};

const respondJSONMeta = (request, response, status) => {
  const headers = {
    'Content-Type': 'application/json',
  };
  // no content to send, just headers!
  response.writeHead(status, headers);
  response.end();
};

const getMovies = (request, response) => {
  // create a parent object to hold the movies object
  // we could add a message, status code etc ... to this parent object
  const responseJSON = {
    movies,
  };

  return respondJSON(request, response, 200, responseJSON);
};
// would also be nice to calculate file size, last-modified date etc ...
// and send that too
const getMoviesMeta = (request, response) => respondJSONMeta(request, response, 200);
const updateMovie = (request, response) => {
  const newMovie = {
    createdAt: Date.now(),
  };

  movies[newMovie.createdAt] = newMovie; // never do this in the real world!
  // 201 status code == "created"
  return respondJSON(request, response, 201, newMovie);
};
const addMovie = (request, response, body) => {
  const responseJSON = {
    message: 'Title, plot, rating, and review are required!',
  };
  if (!body.title || !body.rating || !body.name || !body.review || !body.plot || !body.trailer) {
    responseJSON.id = 'missingParams';
    responseJSON.message = 'Missing params title, plot, name, rating, review, and/or trailer!';
    return respondJSON(request, response, 400, responseJSON);
  }
  const randomID = uuidv4(movies[body.title]); //create a random uuid for each film
  let responseCode = 201;
  if (movies[body.randomID]) {
    responseCode = 204;
  } else {
    movies[body.randomID] = {};
  }
  //set up properties based on the uuid and not the title
  movies[body.randomID].title = body.title;
  movies[body.randomID].rating = body.rating;
  movies[body.randomID].review = body.review;
  movies[body.randomID].name = body.name;
  movies[body.randomID].plot = body.plot;
  movies[body.randomID].trailer = body.trailer;

  
  responseCode = 201;
  if (responseCode === 201) {
    const movieData = {
      title: body.title,
      plot: body.plot,
      rating: body.rating,
      review: body.review,
      trailer: body.trailer,
      name: body.name,
      id: randomID,
    };
    console.log(randomID);
    return respondJSON(request, response, responseCode, movieData);
  }

  return respondJSONMeta(request, response, responseCode);
};

const addReview = (request, response, body) => {
  const responseJSON = {
    message: 'New review, name, and rating are required!',
  };
  if (!body.newReviewer || !body.newReview || !body.newRating) {
    responseJSON.id = 'missingParams';
    responseJSON.message = 'Missing param name, review and/or rating!';
    return respondJSON(request, response, 400, responseJSON);
  }
  let responseCode = 201;
  if (reviews[body.title]) {
    responseCode = 201; //instead of updating the review, add a new one!
  } else {
    reviews[body.title] = {};
  }
  reviews[body.title].movieTitle = body.movieTitle;
  reviews[body.title].newReviewer = body.newReviewer;
  reviews[body.title].newReview = body.newReview;
  reviews[body.title].newRating = body.newRating;

  if (responseCode === 201) {
    const newReviewData = {
      movieTitle: body.movieTitle,
      newReviewer: body.newReviewer,
      newRating: body.newRating,
      newReview: body.newReview,
    };

    return respondJSON(request, response, responseCode, newReviewData);
  }

  return respondJSONMeta(request, response, responseCode);
};

const notFound = (request, response) => {
  const responseJSON = {
    message: 'The page you are looking for was not found!',
    id: 'notFound',
  };
  return respondJSON(request, response, 404, responseJSON);
};

const notFoundMeta = (request, response) => respondJSONMeta(request, response, 404);

module.exports = {
  getMovies,
  getMoviesMeta,
  addMovie,
  addReview,
  updateMovie,
  notFound,
  notFoundMeta,
};
