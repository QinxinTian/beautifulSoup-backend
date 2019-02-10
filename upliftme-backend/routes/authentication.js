var express = require('express');
var app = express();
var bcrypt = require('bcrypt');
var User = require('../models/user');
var bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(function(req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'PUT, GET, POST, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});
/* GET users listing. */

app.post('/register-user', async function(req, res, next) {
  try {
    req.body.password = await bcrypt.hash(req.body.password, 10);
    const { email } = req.body;
    
    const user = await User.findOne({ email });
    if(!user) {
      const data = await User.create(req.body);

      if(!data) return res.send({ status: false, msg: 'User not created, something went wrong' });
      else return res.send({ status: true, msg: 'User created successfully!', data });

    } else {
      return res.send({ status: false, msg: 'User already registered!', data: user });
    }

  } catch(err) {
    return res.send({ status: false, msg: err.message });
  }
});

module.exports = app;
