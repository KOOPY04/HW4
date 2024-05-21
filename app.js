var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var sqlite3 = require('sqlite3').verbose();

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// Open the SQLite database
var dbPath = path.join(__dirname, 'db', 'sqlite.db');
var db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error('Could not open database', err.message);
    } else {
        console.log('Connected to the SQLite database at', dbPath);
    }
});

app.use('/', indexRouter);
app.use('/users', usersRouter);

module.exports = app;
