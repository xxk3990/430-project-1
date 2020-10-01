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
  if (parsedUrl.pathname === '/addReview') {
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

      jsonHandler.addReview(request, response, bodyParams);
    });
  }
};

const urlStruct = {
  GET: {
    '/': htmlHandler.getIndex,
    '/style.css': htmlHandler.getCSS,
    '/client.js': htmlHandler.getClientJS,
    '/getMovies': jsonHandler.getMovies,
    '/updateMovie': jsonHandler.updateMovie,
    notFound: jsonHandler.notFound,
  },
  HEAD: {
    '/getMovie': jsonHandler.getMoviesMeta,
    notFound: jsonHandler.notFoundMeta,
  },
};

const onRequest = (request, response) => {
  const parsedUrl = url.parse(request.url);

  console.dir(parsedUrl.pathname);
  console.dir(request.method);

  // not perfect and will fail if HTTP method is not 'GET' or 'HEAD'
  if (request.method === 'POST') {
    handlePost(request, response, parsedUrl);
  } else if (request.method === 'GET' || request.method === 'HEAD') {
    if (urlStruct[request.method][parsedUrl.pathname]) {
      urlStruct[request.method][parsedUrl.pathname](request, response);
    } else {
      urlStruct[request.method].notFound(request, response);
    }
  }
};

http.createServer(onRequest).listen(port);

console.log(`Listening on 127.0.0.1: ${port}`);
