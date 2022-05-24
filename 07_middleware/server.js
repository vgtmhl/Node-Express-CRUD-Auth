const express = require('express')
const path = require('path')
const cors = require('cors')
const { logger } = require('./middleware/logEvents');
const { errorHandler } = require('./middleware/errorHandler');

const PORT = process.env.PORT || 3500;
const app = express()

/**
 * Middlewares are anything that runs between the request and the response; in a sense, route handlers are middlewares.
 * There are 3 types of middleware:
 *  - built-in middlewares
 *  - custom middlewares
 *  - third-party middlewares
 */

/**
 * Custom middleware logger
 * 
 */
app.use(logger)

/**
 * cross origin request middleware, allows cross-origin requests. 
 */
const whiteList = ['https://www.yoursite.com/', "http://127.0.0.1:5500", "http://localhost:3500"]
const corsOptions = {
    origin: (origin, callback) => {
        // !origin -> origin is falsey, local dev has undefined origin
        if (whiteList.indexOf(origin) !== -1 || !origin) {
            callback(null, true)
        } else {
            callback(new Error('not allowed by cors'))
        }
    },
    optionsSuccessStatus: 200
}
app.use(cors(corsOptions))


/**
 * Middleware to handle URLEncoded data i.e. content-type: "application/x-www-form-urlencoded".
 * app is the server instance, the use method is used to add entries to the middleware stack. 
 * You can invoce app.use for every middleware layer you wish to add. 
 */
app.use(express.urlencoded({ extended: false }))

/**
 * Another useful middleware layer is the one that handles json 
 */
app.use(express.json())

/**
 * And one for static files.
 * express.static tries to find the file __dirname + public + /css/style.css
 * 
 * So when I request /css/style.css, express serves __dirname/public/css/style.css
 */
app.use(express.static(path.join(__dirname, '/public')))



/************************************************************************************************ */

app.get('^/$|/index(.html)?', (req, res) => {
    res.sendFile("./views/index.html", { root: __dirname })
    res.sendFile(path.join(__dirname, 'views/index.html'))
})

app.get('/new-page(.html)?', (req, res) => {
    res.sendFile(path.join(__dirname, 'views/new-page.html'))
})

app.get('/old-page(.html)?', (req, res) => {
    res.redirect(301, '/new-page.html')
})

app.get('hello(.html)?', (req, res, next) => {
    console.log('attemted to load hello.html')
    next();
})

const one = (req, res, next) => {
    console.log('one')
    next()
}

const two = (req, res, next) => {
    console.log('two')
    next()
}

const three = (req, res, next) => {
    console.log('three')
    res.send('finished!')
}

app.get('/chain(.html)?', [one, two, three])

app.all('*', (req, res) => {
    res.status(404);

    if (req.accepts('html')) {
        res.sendFile(path.join(__dirname, 'views', '404.html'))
    }
    else if (req.accepts('json')) {
        res.json({ error: "404 not found" })
    }
    else {
        res.type("txt").send("404 not found")
    }
})

/**
 *  Error handling
 */
app.use(errorHandler)

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

