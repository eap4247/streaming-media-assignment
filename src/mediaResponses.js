// import packages and files
const fs = require('fs'); // filesystem
const path = require('path'); // paths and file objects

// put our file streaming into a single method
const loadFile = (request, response, filepath, contentType) => {
  // create file object to our media file
  const file = path.resolve(__dirname, filepath);

  // provide statistics of file (callback)
  fs.stat(file, (err, stats) => {
    if (err) {
      // Error NO ENTry - File Not Found
      if (err.code === 'ENOENT') {
        response.writeHead(404);
      }
      return response.end(err);
    }

    // check if client sent us a range header
    // client sends us range header to tell us range of bytes they want (buffer)
    let { range } = request.headers;

    // otherwise start at beginning of file (byte 0)
    if (!range) {
      range = 'bytes=0-';
    }

    // parse header to array-useable values
    const positions = range.replace(/bytes=/, '').split('-');
    let start = parseInt(positions[0], 10); // parse first value to base10

    const total = stats.size; // total filesize in bytes
    // tertiary operator => if (condition) ? trueResult : falseResult
    // in this case we check if we have an end position from the header
    const end = positions[1] ? parseInt(positions[1], 10) : total - 1;

    // reset start if it passes the end
    if (start > end) {
      start = end - 1;
    }

    // size of the chunk we are sending to browser
    const chunksize = (end - start) + 1;

    // 206 Partial Content - tells browser it can send ranges but has not gotten the entire file yet
    // Content Range - how much we are sending out of the entire thing
    // Accept Ranges - what type of data to expect the range in (byte or none)
    // Content Length - size of the chunk
    // Content Type - encoding type
    response.writeHead(206, {
      'Content-Range': `bytes ${start}-${end}/${total}`,
      'Accept-Ranges': 'bytes',
      'Content-Length': chunksize,
      'Content-Type': contentType,
    });

    // create a filestream
    const stream = fs.createReadStream(file, { start, end });

    stream.on('open', () => {
      stream.pipe(response);
    });

    stream.on('error', (streamErr) => {
      response.end(streamErr);
    });

    return stream;
  });
};

// deliver party.mp4
// we like to party
const getParty = (request, response) => {
  loadFile(request, response, '../client/party.mp4', 'video/mp4');
};

// deliver bling.mp3
// i like to cha-cha
const getBling = (request, response) => {
  loadFile(request, response, '../client/bling.mp3', 'audio/mpeg');
};

// deliver bird.mp4
// berdthday boy 
const getBird = (request, response) => {
  loadFile(request, response, '../client/bird.mp4', 'video/mp4');
};


// create public objects
module.exports.getParty = getParty;
module.exports.getBling = getBling;
module.exports.getBird = getBird;
