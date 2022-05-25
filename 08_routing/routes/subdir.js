/**
 * Routing for /views/subdir views and assets
 */
const express = require('express');
const router = express.Router();
const path = require('path');

router.get('^/$|/index(.html)?', (req, res) => {
    const file =
        path.join(__dirname, "..", "views", "subdir", "index.html")

    res.sendFile(file)
})

router.get('/test(.html)?', (req, res) => {
    const file =
        path.join(__dirname, "..", "views", "subdir", "test.html")

    res.sendFile(file)
})

module.exports = router