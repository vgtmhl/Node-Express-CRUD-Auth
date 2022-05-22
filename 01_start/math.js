/**
 * Nothing stops us from defining our own modules:D
 */

const add = (a, b) => a + b
const subtract = (a, b) => a - b
const multiply = (a, b) => a * b
const divide = (a, b) => a / b

/**
 * Just like the imports, we use CommonJS syntax 
 */

module.exports = {
    add, subtract, multiply, divide
}

/**
 * We could also export them one by one, and remove the module.exports:
 * 
 * exports.add = (a, b) => a + b
 * exports.subtract = (a, b) => a - b
 * exports.multiply = (a, b) => a * b
 * exports.divide = (a, b) => a / b 
 * 
 * We are just adding stuff to the exports object, doesn't matter how we do it.
 */