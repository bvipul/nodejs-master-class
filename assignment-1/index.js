// Dependencies
const http = require('http');
const url = require('url');
const stringDecoder = require('string_decoder').StringDecoder;

// Instantiate the server
const server = http.createServer((req, res) => {
    // Get the url and parse it
    const parsedUrl = url.parse(req.url, true);
    
    // Get the path
    const path = parsedUrl.pathname;
    const trimmedPath = path.replace(/^\/+|\/+$/g, '');

    // Get the payload, if any
    const decoder = new stringDecoder('utf-8');
    
    let buffer = '';

    req.on('data', (data) => {
        buffer += decoder.write(data);
    });

    req.on('end', () => {
        buffer += decoder.end();
        console.log(router, router[trimmedPath], trimmedPath);
        // Choose the handler for the request path or choose notFound
        const chosenHandler = typeof(router[trimmedPath]) !== 'undefined' ? router[trimmedPath] : handlers.notFound;

        chosenHandler(buffer, (statusCode, payload) => {

            // Set the statusCode to the status code the handler gave us or default to 200
            statusCode = typeof(statusCode) == 'number' ? statusCode : '200';

            // Set the payload to the payload sent by handler or default to an empty object
            payload = typeof(payload) == 'object' ? payload : {};

            // Send the payload
            res.setHeader('Content-Type', 'application/json');
            res.writeHead(statusCode);
            res.end(JSON.stringify(payload));
        });
    });
});


const port = 8000;

// Start the server
server.listen(port, () => console.log(`Server started on port: ${port}`));

const handlers = {
    hello: (data, callback) => {
        callback(200, {
            message: "Hello from the Node world! Have fun while you're here!"
        });
    },
    notFound: (data, callback) => {
        callback(404, {
            message: "I think you are lost! Find your way to Node world at /hello"
        });
    }
}

const router = {
    'hello': handlers.hello
};