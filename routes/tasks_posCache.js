// Google App Engine + node.js Sample
//   [Routing] '/tasks/pos_cache/'
//   Copyright 2019 Technosite Corp.

const express = require('express');
const {Firestore} = require('@google-cloud/firestore');
const fs = require('fs');
const firestore = new Firestore();
const router = express.Router();

router.get('/', (req, res) => {
    console.log('[GET]');
    console.log('*** pos_chache');
    res.end();
});
