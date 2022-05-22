const { logEvents } = require("./logEvents.js");
const eventTypes = {
    LOG: "log"
}

/**
 * To use events, we have a common core package called 'events'
 */
const EventEmitter = require('events')
class MyEmitter extends EventEmitter { }

/**
 * Initialize the object
 */
const myEmitter = new MyEmitter();

/**
 * Add a listener for the log event 
 */
myEmitter.on(eventTypes.LOG, (msg) => logEvents(msg))

setTimeout(() => {
    myEmitter.emit(eventTypes.LOG, "Log event emitted")
}, 2500)