const express = require('express')
const path = require('path')
const cors = require('cors')
const corsOptions = require("./config/corsOptions")
const { logger } = require('./middleware/logEvents');
const { errorHandler } = require('./middleware/errorHandler');

/**
 * JWT = JSON Web Tokens, a form of user identification issued after initial user authentication.
 * Once the client is authenticated, our backend will issue the client:
 * - 1 access token
 * - 1 refresh token
 * 
 * The access token is given a short life (5/15m).
 * The reference token is given a longer duration (several hours, even days sometimes)
 * 
 * After this duration, the tokens will expire. Tokens that live too long might expose you to XSS/CSRF.
 * 
 * Our API will send and receive tokens as JSON data. Frontend clients apps should store access tokens IN MEMORY,
 * so they will be automatically lost when the app is closed. They should NOT be stored in localStorage or cookies.
 * > If you can store it somewhere with JS, then malicious code can retrieve it with JS.
 * > By "in memory", I mean the current application state.
 * 
 * Refresh token is issued in an HttpOnly cookie. This type of cookie is NOT accessible via JS and must have
 * an expiration date.
 * 
 * [ACCESS TOKEN FLOW]
 * - Access token is issued to the user at authentication time
 * - Client uses the access token to access our protected APIs, until the token expires
 * - On each request, the token is verified with a middleware
 * - When the token expires, the user application will send a request to the refresh endpoint with a refresh token
 *   to get a new access token 
 * 
 * [REFRESH TOKEN FLOW]
 * - Refresh token is issued to the user at authentication time
 * - Client uses the refresh token to request a new access token when his previous token expires
 * - Our backend will verify the refresh token and cross-verify the token with our database
 * - Storing refresh tokens in the db allows us to terminate them early if the user decides to log out
 * - Refresh tokens, too, must have an expiration date
 * 
 * Keys are generate by opening node in the terminal and using the crypto core package: 
 * require('crypto').randomBytes(64).toString('hex')
 */
const verifyJwt = require("./middleware/verifyJwt")
const cookieParser = require("cookie-parser")

const PORT = process.env.PORT || 3500;
const app = express()

// Middlewares
app.use(logger)
app.use(cors(corsOptions))
app.use(express.urlencoded({ extended: false }))
app.use(express.json())
app.use(cookieParser())

// serve static files
app.use(express.static(path.join(__dirname, '/public')))

// register routes
app.use('/', require('./routes/root'))
app.use('/register', require('./routes/register'))
app.use('/auth', require('./routes/auth'))
app.use('/refresh', require('./routes/refresh'))

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
