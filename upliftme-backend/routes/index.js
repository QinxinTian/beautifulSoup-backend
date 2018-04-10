var express = require('express');
var router = express.Router();
var mongo = require('mongodb');
var assert= require('assert');

var url = 'mongodb://localhost:27017/upliftdb';

router.get()

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

module.exports = router;
