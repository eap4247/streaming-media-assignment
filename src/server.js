// import packages and scripts
const http = require('http'); // basic http

const htmlHandler = require('./htmlResponses.js');
const mediaHandler = require('./mediaResponses.js');

// Set port to Heroku's env variables, or fallback to port 3000
const port = process.env.PORT || process.env.NODE_PORT || 3000;

// called when a connection is made to the server
const onRequest = (request, response) => {
  console.log(request.url); // print the url connected to

  switch (request.url) {
    case '/':
      htmlHandler.getIndex(request, response);
      break;
    case '/party.mp4':
      mediaHandler.getParty(request, response);
      break;
    default:
      htmlHandler.getIndex(request, response);
      break;
  }
};

// create the server
http.createServer(onRequest).listen(port);

console.log(`Listening on 127.0.0.1 ${port}`);
