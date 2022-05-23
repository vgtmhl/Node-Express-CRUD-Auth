/**
 * In this module I will implement a basic web server. Normally, one would not implement this from scratch.
 * One would instead use someting like Express. 
 * 
 * But free implementation is a great way to understand how things work :D
 */

const http = require('http');
const path = require('path');
const fs = require('fs');
const fsPromises = require('fs').promises;
const { logEvents } = require('./logEvents')
const EventEmitter = require('events');

// Initialize emitter
class Emitter extends EventEmitter { }
const myEmitter = new Emitter()
myEmitter.on('log', (msg, fileName) => logEvents(msg, fileName))


async function serveFile(filePath, contentType, res) {
    try {
        const rawData = await fsPromises.readFile(
            filePath,
            contentType.includes('image') ? "" : 'utf8'
        );

        const data = contentType === "application/json" ? JSON.parse(rawData) : rawData

        res.writeHead(
            filePath.includes('404.html') ? 404 : 200,
            { 'Content-Type': contentType }
        )

        res.end(
            contentType === "application/json" ? JSON.stringify(data) : data
        )

    } catch (e) {
        myEmitter.emit('log', `${err.name}: ${err.message}`, 'errorLog.txt')
        console.error(e)
        res.statusCode = 500;
        res.end()
    }
}


// config 
const PORT = process.env.PORT || 3500;

/**
 * Creation of a minimal server:
 * 
 * Intuitive solution: this is not what is usually used in prod applications, but it does 
 * help explaining the underlying logic.
 * 
 
const server = http.createServer((req, res) => {
const url = req.url

if (url === "/" || url === "index.html") {
    res.statusCode = 200;
    res.setHeader('content-type', 'text/index.html');

    let filePath = path.join(__dirname, 'views', 'index.html')

    fs.readFile(filePath, 'utf8', (err, data) => {
        res.end(data)
    })
}
})
 */

/* Better way to create a minimal server */
const server = http.createServer((req, res) => {

    myEmitter.emit('log', `${req.url}\t${req.method}`, 'reqLog.txt')

    const extension = path.extname(req.url);

    let contentType = getContentType(extension)
    const fileToServe = getFilePath(req, contentType)

    const fileExists = fs.existsSync(fileToServe)
    if (fileExists) {
        serveFile(fileToServe, contentType, res)

    } else {
        const base = path.parse(fileToServe).base

        switch (base) {
            case "old-page.html": {
                res.writeHead(301, {
                    'Location': "new-page.html"
                })
                res.end;
                break;
            }
            case "www-page.html": {
                res.writeHead(301, {
                    'Location': "/"
                })
                res.end;
                break;
            }
            default: {
                let fallbackFile = path.join(__dirname, 'views', '404.html')

                serveFile(fallbackFile, "text/html", res)

            }
        }
    }

})

// set server to listen
server.listen(PORT, () => console.log(`server running on port ${PORT}`))



/**
 * Utils
 */

function getContentType(extension) {
    switch (extension) {
        case ".css": {
            return 'text/css';
        }
        case ".js": {
            return 'application/javascript';
        }
        case ".json": {
            return 'application/json';
        }
        case ".jpg":
        case ".png": {
            return 'image/jpeg';
        }
        case ".txt": {
            return 'text/plain';
        }
        default: {
            return 'text/html';
        }
    }
}

function getFilePath(req, contentType) {
    if (contentType === "text/html") {

        // request for html page, / is the url => we serve the default index.html
        if (req.url === "/") {
            return path.join(__dirname, 'views', "index.html")
        }

        // request for html page, the last character is a slash, so we are requesting something from a subdir
        if (req.url.slice(-1) === "/") {
            return path.join(__dirname, 'views', req.url, "index.html")
        }

        // request for html, return the view
        return path.join(__dirname, 'views', req.url)
    }

    // if the request is not a page, then return the file
    return path.join(__dirname, req.url)
}