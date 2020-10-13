// Note this object is purely in memory
const movies = {};
// const reviews = {};
const {
  v4: uuidv4,
} = require('uuid'); // import uuid version 4, v4 creates random uuids

const respondJSON = (request, response, status, object) => {
  response.writeHead(status, status, {
    'Content-Type': 'application/json',
  });
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
  // //ONLY WORKS THIS WAY
  // for (const mov of Object.keys(responseJSON.movies)) {
  //   if (!params.best || params.best !== 'true') {
  //     return respondJSON(request, response, 200, responseJSON); //do normal stuff
  //   } else {
  //     if (responseJSON.movies[mov].review.rating >= 3.5) {
  //       responseJSON.movies = responseJSON.movies[mov];
  //       return respondJSON(request, response, 200, responseJSON.movies)
  //     } else {
  //       delete responseJSON.movies[mov];
  //       return respondJSON(request, response, 200, responseJSON);
  //     }
  //     // console.dir(mov)
  //   }
  //   // return respondJSON(request, response, 200, responseJSON);
  // }

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
  if (!body.title || !body.rating || !body.reviewer_name
    || !body.trailer || !body.review || !body.plot) {
    responseJSON.id = 'missingParams';
    responseJSON.message = 'Missing params title, plot, name, trailer, rating, and review';
    return respondJSON(request, response, 400, responseJSON);
  }
  const randomID = uuidv4(movies); // create a random uuid for each film
  let responseCode = 201;
  if (movies[randomID]) {
    responseCode = 204;
  } else {
    movies[randomID] = {};
  }

  movies[randomID].title = body.title;
  movies[randomID].rating = body.rating;
  movies[randomID].review = body.review;
  movies[randomID].reviewer_name = body.reviewer_name;
  movies[randomID].plot = body.plot;
  movies[randomID].trailer = body.trailer;
  responseCode = 201;
  if (responseCode === 201) {
    movies[randomID] = {
      title: body.title,
      id: randomID,
      plot: body.plot,
      review: {
        /* review is nested child object. It didn't make sense to have name in parent object,
            has nothing to do with movie */
        reviewer_name: body.reviewer_name,
        rating: body.rating,
        review: body.review,
      },
      trailer: body.trailer,
    };
    return respondJSON(request, response, responseCode, movies[randomID]);
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
  updateMovie,
  notFound,
  notFoundMeta,
};
