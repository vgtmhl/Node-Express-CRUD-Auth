const express = require('express')
const path = require('path')
const cors = require('cors')
const corsOptions = require("./config/corsOptions")
const { logger } = require('./middleware/logEvents');
const { errorHandler } = require('./middleware/errorHandler');

/**
 * Little distinguo between 2 similar terms:
 * - AUTHENTICATION => process of verifying who someone in.
 * - AUTHORIZATION => process of verifying what specific resources that user has access to.
 * 
 * Login takes care of AUTHENTICATION, then the server uses JWT tokens to take care of AUTHORIZATION.
 */
const verifyJwt = require("./middleware/verifyJwt")
const cookieParser = require("cookie-parser");
const credentials = require('./middleware/credentials');

const PORT = process.env.PORT || 3500;
const app = express()

// Middlewares
app.use(logger)
app.use(credentials)
app.use(cors(corsOptions))
app.use(express.urlencoded({ extended: false }))
app.use(express.json())
app.use(cookieParser())

// serve static files
app.use(express.static(path.join(__dirname, '/public')))

// routes
app.use('/', require('./routes/root'))
app.use('/register', require('./routes/register'))
app.use('/auth', require('./routes/auth'))
app.use('/refresh', require('./routes/refresh'))
app.use('/logoutContoller', require('./routes/logout'))

/**
 * since middlewares work in a waterfall fashion, anything after this line will have to go through
 * verifyJwt middleware
 */
app.use(verifyJwt)
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
