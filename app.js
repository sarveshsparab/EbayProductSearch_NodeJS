var express = require('express');
var bodyParser = require('body-parser');
let cors = require('cors');
require('dotenv').config();

var index = require('./routes/index');
var ebayFind = require('./routes/ebay/find');
var ebayItemDetail = require('./routes/ebay/getDetail');
var ebaySimilarItem = require('./routes/ebay/getSimilar');
var zipAuto = require('./routes/zipAuto');
var prodPhotos = require('./routes/prodPhoto');

var app = express();

app.use(cors());

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

app.use('/', index);
app.use('/ebay/find', ebayFind);
app.use('/ebay/detail', ebayItemDetail);
app.use('/ebay/similar', ebaySimilarItem);
app.use('/zipAuto', zipAuto);
app.use('/photos', prodPhotos);


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  res.status(200).json({
    ResponseStatus: "Error",
    ResponseMessage: "Resource Not Found"
  });
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});


module.exports = app;
