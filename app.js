// Google App Engine + node.js Sample
//   Copyright 2019 Technosite Corp.

'use strict';

const express = require('express');
const bodyParser = require('body-parser');
const app = express();

const root = require('./routes/root');
const pos = require('./routes/pos');
const api_pos = require('./routes/api_pos');
const tasks_posChache = require('./routes/tasks_posCache');

//### config
app.use(express.static('static'));    // 静的ファイル・フォルダ
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

//### routing
app.use('/', root);
app.use('/pos', pos);
app.use('/api/pos', api_pos);
app.use('/tasks/pos_cache', tasks_posChache);

//### Start the server
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
  console.log('Press Ctrl+C to quit.');
});

module.exports = app;
