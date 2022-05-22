/**
 * https://nodejs.org/en/docs/ is the source of truth for Node, just like MDN is for Vanilla JS.
 */
const fs = require("fs")
const path = require("path")

fs.readFile(path.join(__dirname, "files", "starter.txt"), 'utf8', (err, data) => {
    if (err) throw err

    /**
     * This is an asynchronous call. Now the content of starter.txt is stored in data if the read was successful.
     * I can print out the value:
     * 
     * console.log(data) -> Buffered representation
     * console.log(data.toString()) -> Plain string representation
     */

    console.log(data.toString())
})

/**
 * This will be printed BEFORE the console.log in the readFile function, this is because 
 * read/write are performed asynchronously!
 */
console.log('I am synchronous')

/**
 * We can write files, too. The default mode is overwrite, so running this a second time will replace the file content.
 */
const reply = "Nice to meet you"
const writeDst = path.join(__dirname, "files", "reply.txt")

fs.writeFile(writeDst, reply, (err) => {
    if (err) throw err

    console.log("Write completed")
})

/**
 * If we wish to output a stream of stuff to the file, we can switch to append mode.
 * appendFile, just like writeFile, will create a file if it doesn't already exist'
 * 
 * Given the asynchronous nature of this code, it's possible that appendFile will run before writeFile.
 * This would be bad because we'd write "another dog and" to the file, which would then be overwritten.
 * 
 * To avoid this, we could move this block of code INSIDE the writeFile callback
 */
const appendDst = path.join(__dirname, "files", "append.txt")
const content = "another dog and "

fs.appendFile(appendDst, content, err => {
    if (err) throw err

    console.log('append complete')
})

/**
 * I can even rename files.
 * 
 * If this happens before any of the previous calls, the previous calls will detect there is no reply.txt and create one.
 * 
 * This is another call that should be done inside the writeFile callback
 */
const src = path.join(__dirname, "files", "reply.txt")
const dst = path.join(__dirname, "files", "newReply.txt")
fs.rename(src, dst, (err) => {
    if (err) throw err

    console.log('rename complete')
})


/**
 * So at the end we will find ourselves in a situation like:
 * 
 * fs.writeFile(... ()= > {
 *   fs.appendFile( ... () => {
 *     fs.rename( ... () => {
 *       ...
 *     })
 *   })
 * })
 * 
 * And there we go, in callback hell :/
 * 
 * In vanilla, we get around this by using async/await. 
 * In node, we can do the same by using a different core package!
 */

const fsPromises = require('fs').promises


const srcFile = path.join(__dirname, "files", "starter.txt")
const srcPromiseWrite = path.join(__dirname, "files", "promiseWrite.txt")

const fileOps = async () => {
    try {
        const data = await fsPromises.readFile(srcFile, 'utf8');
        console.log(data.toString())
        await fsPromises.writeFile(srcPromiseWrite, data)
        await fsPromises.appendFile(srcPromiseWrite, "\n\nNice to meet you")
        /**
         * I can continue adding async actions here without getting into callback hell.
         * 
         * I have to wrap this await code because await is only available in async functions
         * and at the top level of bodies of modules
         */

    } catch (err) {
        console.log(err)
    }
}

fileOps()

/**
 * Other calls: 
 * fs.unlink(filePath) => deletes the file 
 */











/**
 * handle exception. process is a global variable always available in Node. 
 */
process.on('uncaughtException', (err) => {
    console.error(`Uncaught exception: ${err}`)
    process.exit(1)
})