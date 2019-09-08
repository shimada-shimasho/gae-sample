// Google App Engine + node.js Sample
//   [Routing] '/'
//   Copyright 2019 Technosite Corp.

const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
    res.sendFile(__dirname + '/static/index.html');
 });

module.exports = router;
