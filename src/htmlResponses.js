const fs = require('fs'); // pull in the file system module

const index = fs.readFileSync(`${__dirname}/../client/client.html`);
const css = fs.readFileSync(`${__dirname}/../client/style.css`);
const js = fs.readFileSync(`${__dirname}/../client/client.js`);
const bgImg = fs.readFileSync(`${__dirname}/../client/theater-bg.jpg`);

const getIndex = (request, response) => {
  response.writeHead(200, { 'Content-Type': 'text/html' });
  response.write(index);
  response.end();
};

const getCSS = (request, response) => {
  response.writeHead(200, { 'Content-Type': 'text/css' });
  response.write(css);
  response.end();
};

const getBgImage = (request, response) => {
  response.writeHead(200, { 'Content-Type': 'image/jpeg' });
  response.write(bgImg);
  response.end();
};

// get client.js file
const getClientJS = (request, response) => {
  response.writeHead(200, {
    'Content-Type': 'text/javascript',
  });
  response.write(js);
  response.end();
};

module.exports = {
  getIndex,
  getCSS,
  getClientJS,
  getBgImage,
};
