/**
 * With larger files, you probably don't want to read the whole thing all at once.
 * So we can split things into chunks
 */

const fs = require('fs')
const path = require('path')

const src = path.join(__dirname, 'files', 'lorem.txt')
const dst = path.join(__dirname, 'files', 'new_lorem.txt')
const options = { encoding: 'utf8' }

const rs = fs.createReadStream(src, options)
const ws = fs.createWriteStream(dst)

// rs.on('data', (chunk) => {
//     let newChunk = chunk.toString().toUpperCase()
//     ws.write(newChunk)
// })

/**
 * There is an even better way to do this:
 */

rs.pipe(ws)