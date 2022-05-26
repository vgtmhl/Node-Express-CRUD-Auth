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

module.exports = router