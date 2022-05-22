/**
 * differences between JS in the browser and node:
 * 
 * - node is a runtime system that allows to run JavaScript code on your local machine. It is based on V8 JS Engine by Google.
 * - node therefore runs in the server (back-end).
 * - the console is in the terminal, not in the browser devtools.
 * - there is no window object. There is, instead, a global object.
 * - node has a set of core modules that are part of the platform and come with the Node.js installation.
 */

/* node does not use ES6 imports, but CommonJS imports instead */
const os = require('os')

/* we can use the os core module to get information about the server machine OS */
console.log(os.type())
console.log(os.version())
console.log(os.homedir())

/* there are some values to which we always have access to */
console.log(__dirname)
console.log(__filename)

/* another very common module is path */
const path = require('path')
console.log(path.dirname(__filename))
console.log(path.basename(__filename))
console.log(path.extname(__filename))
console.log(path.parse(__filename))

/* import the module we created. Note this is not a core module, hence we need to use the path
we could destructure like:
const {add, subtract} = require("./math") */
const math = require("./math")
console.log(math.add(3, 2))

/**
 * Node is missing some APIs that are missing from VanillaJS, and some of the have been implemented with external packages :)
 * This was the case of Fetch until very little time ago, but now Fetch is available in NodeJS core <3
 */