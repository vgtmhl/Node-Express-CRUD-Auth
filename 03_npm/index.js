/**
 * Let's install nodemon globally (node add nodemon -g). So I can now call nodemon from CLI.
 * I can now call nodemon from the console. By default, it will look for index.js 
 * (or I could say nodemon server.js if my file was called server.js)
 * 
 * What nodemon does is watching our file, and refresh the server automatically when changes are made.
 */

console.log('1 2 3 4')

/**
 * We added a package globally, now we want to add local packages, so we gotta initialize node in this directory
 * by going npm init 
 * 
 * This will create a package.json with the information we entered from npm init.
 * 
 * Now let's add a package: npm add date-fns.
 * And a dev dep: npm add nodemon --save-dev (we have nodemon installed globally so this is just for show)
 * And let's also add npm add uuid
 * 
 * This will add a line to package.json and a package-lock.json, as well as node_modules. 
 * Let's immediately add node_modules to a .gitignore
 * 
 * remmeber:
 * 1.0.0 => will use exactly version 1.0.0
 * ~1.0.0 => will use approx an equivalent version to 1.0.0, so it will still bring in patches, so 1.0.x
 * ^1.0.0 => will use the most recent version compatible with 1.0.0, meaning 1.x.x
 * 
 * this works according to semVer, there the x.y.z notation stands for:
 * major_release.minor_release.patch 
 * 
 * You can uninstall dependencies by npm rm dep_name (along with appropriate flags)
 */

const { format } = require('date-fns')
const { v4: uuid } = require('uuid')

console.log(format(new Date(), 'yyyy/MM/dd\tHH:mm:ss'))
console.log(uuid())