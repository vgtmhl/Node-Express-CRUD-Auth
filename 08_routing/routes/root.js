/**
 * Routing for root views and assets
 */
const express = require('express');
const router = express.Router();
const path = require('path');

router.get('^/$|/index(.html)?', (req, res) => {
    const file = path.join(__dirname, '..', 'views', 'index.html');
    res.sendFile(file)
})

router.get('/new-page(.html)?', (req, res) => {
    const file = path.join(__dirname, '..', 'views', 'new-page.html');
    res.sendFile(file)
})

/** redirect does not need to be amended */
router.get('/old-page(.html)?', (req, res) => {
    res.redirect(301, 'new-page.html')
})

module.exports = router