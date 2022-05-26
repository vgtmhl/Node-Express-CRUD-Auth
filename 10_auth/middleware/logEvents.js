const fs = require('fs')
const fsPromises = require('fs').promises
const path = require('path');

const { format } = require('date-fns')
const { v4: uuid } = require('uuid')

const logEvents = async (message, logName) => {
    const dateTime = format(new Date(), 'yyyyMMdd\tHH:mm:ss')
    const logItem = `${dateTime}\t${uuid()}\t${message}\n`
    console.log(logItem)

    try {
        if (!fs.existsSync(path.join(__dirname, "..", 'logs'))) {
            await fsPromises.mkdir(path.join(__dirname, "..", 'logs'))
        }

        await fsPromises.appendFile(path.join(__dirname, "..", 'logs', logName), logItem)

    } catch (err) { console.error(err) }
}

const logger = (req, res, next) => {
    logEvents(`${req.method}\t${req.headers.origin}\t${req.url}`, 'req.log.txt')
    console.log(`${req.method} ${req.path}`)

    // next() with no arguments says "just kidding, I don't actual want to handle this"
    // so you just pass the request down to the next middleware.
    // In here we do not want to say "this middleware handles all requests exclusively":
    // this middleware will handle all requests, and then pass them down to all other middlwares!
    next();
}

module.exports = {
    logEvents,
    logger
}