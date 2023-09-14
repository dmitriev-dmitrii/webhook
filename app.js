var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var {getConnectionsList , deleteConnectionByUrl } = require('./connections')
require('dotenv').config()

var path = require('path');
global.appRootPath = path.resolve(__dirname);

var indexRouter = require('./routes/index');
var whatsAppRouter = require('./routes/webhook/whats-app');

var app = express();
// view engine setup

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use( '/webhook',whatsAppRouter);



module.exports = app;
