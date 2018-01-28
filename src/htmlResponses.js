// import packages and files
const fs = require('fs'); // filesystem

const index = fs.readFileSync(`${__dirname}/../client/client.html`);

// deliver client.html
const getIndex = (request, response) => {
  response.writeHead(200, { 'Content-Type': 'text/html' });
  response.write(index);
  response.end();
};

// create public objects
module.exports.getIndex = getIndex;
