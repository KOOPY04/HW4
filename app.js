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

// 連接到SQLite資料庫
var db = new sqlite3.Database('db/sqlite.db', (err) => {
    if (err) {
        console.error('Could not open database', err.message);
    } else {
        console.log('Connected to the SQLite database at', 'db/sqlite.db');
    }
});

app.use('/', indexRouter);
app.use('/users', usersRouter);

// 定義 /search 路由處理函數
router.get('/search', function(req, res, next) {
    var query = req.query;
    var startYear = query.startYear || '';
    var endYear = query.endYear || '';
    var yuzuTypes = Array.isArray(query.yuzuType) ? query.yuzuType : [query.yuzuType];

    // SQL 查詢
    var sql = 'SELECT Year';
    var params = [];


    sql += ' FROM YuzuPrices WHERE 1=1';

    // 起始年份篩選條件
    if (startYear) {
        sql += ' AND Year >= ?';
        params.push(startYear);
    }
    // 結束年份篩選條件
    if (endYear) {
        sql += ' AND Year <= ?';
        params.push(endYear);
    }

    // 執行查詢
    db.all(sql, params, (err, rows) => {
        if (err) {
            console.error('查詢執行錯誤', err.message);
            res.status(500).json({ error: '內部服務器錯誤' });
        } else {
            res.json(rows);
        }
    });
});



module.exports = app;
