const express = require('express')
const path = require('path')
const cors = require('cors')
const { logger } = require('./middleware/logEvents');
const { errorHandler } = require('./middleware/errorHandler');

const PORT = process.env.PORT || 3500;
const app = express()

// register the logger
app.use(logger)

// register middlewares
const whiteList = ['https://www.yoursite.com/', "http://127.0.0.1:5500", "http://localhost:3500"]
const corsOptions = {
    origin: (origin, callback) => {
        if (whiteList.indexOf(origin) !== -1 || !origin) {
            callback(null, true)
        } else {
            callback(new Error('not allowed by cors'))
        }
    },
    optionsSuccessStatus: 200
}
app.use(cors(corsOptions))
app.use(express.urlencoded({ extended: false }))
app.use(express.json())

// serve static files
app.use(express.static(path.join(__dirname, '/public')))
app.use('/subdir', express.static(path.join(__dirname, '/public')))

// register routers
app.use('/', require('./routes/root'))
app.use('/subdir', require('./routes/subdir'))

// apis 
app.use('/employees', require('./routes/api/employees'))

// 404 fallback
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

// register final middleware: since they cascade, the order is important.
app.use(errorHandler)
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

