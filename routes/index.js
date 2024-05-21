var express = require('express');
var router = express.Router();
var sqlite3 = require('sqlite3').verbose();
var path = require('path');

// 打开 SQLite 数据库
var dbPath = path.join(__dirname, '..', 'db', 'sqlite.db');
var db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('无法打开数据库', err.message);
  } else {
    console.log('已连接到 SQLite 数据库', dbPath);
  }
});

router.get('/search', function(req, res, next) {
  var query = req.query;
  var startYear = query.startYear || '';
  var endYear = query.endYear || '';
  var yuzuTypes = Array.isArray(query.yuzuType) ? query.yuzuType : [query.yuzuType]; // 处理多个 yuzuType 值

  // 构建 SQL 查询
  var sql = 'SELECT Year';
  var params = [];

  if (yuzuTypes.includes('all') || yuzuTypes.length === 0) {
    sql += ', Wendan, GrapeFruit, XishiYuzu';
  } else {
    yuzuTypes.forEach(type => {
      sql += `, ${type}`;
    });
  }

  sql += ' FROM YuzuPrices WHERE 1=1';

  if (startYear) {
    sql += ' AND Year >= ?';
    params.push(startYear);
  }
  if (endYear) {
    sql += ' AND Year <= ?';
    params.push(endYear);
  }

  // 执行查询
  db.all(sql, params, (err, rows) => {
    if (err) {
      console.error('查询执行错误', err.message);
      res.status(500).json({ error: '内部服务器错误' });
    } else {
      res.json(rows);
    }
  });
});


module.exports = router;
