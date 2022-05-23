const express = require('express')
const path = require('path')

/**
 * We are going to create a minimal web server using Express, instead of just vanilla Node like we did in module 5.
 * 
 * N.B. Paths are resolved from top to bottom. 
 * 
 * Also, Express takes care of setting the correct status code and content type.
 */

const PORT = process.env.PORT || 3500;
const app = express()

/**
 * ROUTE HANDLERS:
 */

// '/' will match any slash in the path. 
// So we use a regex instead
app.get('^/$|/index(.html)?', (req, res) => {
    // accepts a path to the file, and the root for the path
    res.sendFile("./views/index.html", { root: __dirname })

    // alternative: use the same way as we used with vanilla Node
    res.sendFile(path.join(__dirname, 'views/index.html'))
})

app.get('/new-page(.html)?', (req, res) => {
    res.sendFile(path.join(__dirname, 'views/new-page.html'))
})

app.get('/old-page(.html)?', (req, res) => {
    res.redirect(301, '/new-page.html') // defaults to 302, but we want a 301, so we specify it.
})

app.get('hello(.html)?', (req, res, next) => {
    console.log('attemted to load hello.html')
    next(); // moves to the next route handler
})

/**
 * ROUTE HANDLER CHAINING. They work pretty much like middlewares.
 */

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

// Will trigger function one, two and three in that order.
app.get('/chain(.html)?', [one, two, three])

/**
 * CUSTOM 404 FALLBACK (route handlers are cascading, so it has to be the last one)
 */

// no previous matches, fallback to custom 404.
app.get('/*', (req, res) => {
    res.status(404).sendFile(path.join(__dirname, 'views', '404.html'))
})


app.listen(PORT, () => console.log(`Server running on port ${PORT}`));