const http = require('http');
const url = require('url');
const query = require('querystring');
const htmlHandler = require('./htmlResponses.js');
const jsonHandler = require('./jsonResponses.js');

const port = process.env.PORT || process.env.NODE_PORT || 3000;
const handlePost = (request, response, parsedUrl) => {
  if (parsedUrl.pathname === '/addMovie') {
    const body = [];
    request.on('error', (err) => {
      console.dir(err);
      response.stausCode = 400;
      response.end();
    });

    request.on('data', (chunk) => {
      body.push(chunk);
    });

    request.on('end', () => {
      const bodyString = Buffer.concat(body).toString();
      const bodyParams = query.parse(bodyString);

      jsonHandler.addMovie(request, response, bodyParams);
    });
  }
  // if (parsedUrl.pathname === '/addReview') {
  //   const body = [];
  //   request.on('error', (err) => {
  //     console.dir(err);
  //     response.stausCode = 400;
  //     response.end();
  //   });
  //   request.on('data', (chunk) => {
  //     body.push(chunk);
  //   });
  //   request.on('end', () => {
  //     const bodyString = Buffer.concat(body).toString();
  //     const bodyParams = query.parse(bodyString);

  //     jsonHandler.addReview(request, response, bodyParams);
  //   });
  // }
};

const urlStruct = {
  GET: {
    '/': htmlHandler.getIndex,
    '/getMovies': jsonHandler.getMovies,
    '/style.css': htmlHandler.getCSS,
    '/client.js': htmlHandler.getClientJS,
    '/updateMovie': jsonHandler.updateMovie,
    '/theater-bg.jpg': htmlHandler.getBgImage,
    notFound: jsonHandler.notFound,
  },
  HEAD: {
    '/getMovies': jsonHandler.getMoviesMeta,
    notFound: jsonHandler.notFoundMeta,
  },
};

const onRequest = (request, response) => {
  const parsedUrl = url.parse(request.url);
  const params = query.parse(parsedUrl.query);
  console.dir(parsedUrl.pathname);
  console.dir(request.method);
  if (parsedUrl.pathname === '/getMovies') {
    jsonHandler.getMovies(request, response, params);
  }
  if (request.method === 'POST') {
    handlePost(request, response, parsedUrl);
  } else if (request.method === 'GET' || request.method === 'HEAD') {
    if (parsedUrl.pathname !== '/getMovies') {
      if (urlStruct[request.method][parsedUrl.pathname]) {
        urlStruct[request.method][parsedUrl.pathname](request, response);
      } else {
        urlStruct[request.method].notFound(request, response);
      }
    }
  }
};

http.createServer(onRequest).listen(port);

console.log(`Listening on 127.0.0.1: ${port}`);
