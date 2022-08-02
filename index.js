'use strict';

const express     = require('express');
require('dotenv').config();
let app = express();

const apiRoutes = require('./routes/converter');

app.use('/public', express.static(process.cwd() + '/public'));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//Index page (static HTML)
app.route('/')
  .get(function (req, res) {
    res.sendFile(process.cwd() + '/views/index.html');
  });

app.use(apiRoutes);  
    
//404 Not Found Middleware
app.use(function(req, res, next) {
  res.status(404)
    .type('text')
    .send('Not Found');
});

const port = process.env.PORT || 3000;

//Starting server
app.listen(port, function () {
  console.log("Listening on port " + port);
});
