const whiteList = [
    "https://www.yoursite.com/",
    "http://127.0.0.1:5500",
    "http://localhost:3500"
]

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

module.exports = corsOptions