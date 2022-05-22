/**
 * And ofc we can fiddle with directories
 */

const fs = require('fs');

/**
 * do not create a dir if it already exists.
 * fs.exists is definitely a thing, but it's non blocking: we want this check to either
 * - be made synchronously and be blocking
 * - be in the throw: if err === ENOENT (dir does not exist) then do things
 * 
 * Or we can use existsSync instead.
 */
if (!fs.existsSync("./new")) {
    fs.mkdir("./new", (err) => {
        if (err) throw err;
        console.log('dir created')
    })
}

if (fs.existsSync("./new")) {
    fs.rmdir("./new", (err) => {
        if (err) throw err;
        console.log('dir removed')
    })
}