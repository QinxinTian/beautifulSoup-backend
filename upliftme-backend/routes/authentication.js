var express = require('express');
var app = express();
var bcrypt = require('bcrypt');
var User = require('../models/user');
var jwt = require('jsonwebtoken');
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
    //encrypting for security so it is not readable without decrypting it
    const user = await User.findOne({ email });
    if(!user) {
      //verifying if the user existed otherwise creating a new one
      const data = await User.create(req.body);

      if(!data) return res.send({ status: false, msg: 'User is not created, something went wrong' });
      else return res.send({ status: true, msg: 'User is created successfully!', data });

    } else {
      return res.send({ status: false, msg: 'User already registered!', data: user });
    }

  } catch(err) {
    return res.send({ status: false, msg: err.message });
  }
});

app.post('/login-user', async function(req, res, next) {
  try {
    const request = req.body;
    const { email } = request;
    //https://mongoosejs.com/docs/queries.html
    const user = await User.findOne({ email });
    if(user) {
      const { password } = user;
      //https://www.abeautifulsite.net/hashing-passwords-with-nodejs-and-bcrypt
      const isVerified = await bcrypt.compare(request.password, password);
      if(isVerified) {
        //json web token
        //signed token
        //https://jwt.io/introduction/
        const token = await jwt.sign({
          data: email
        }, 'secret');
        if( token) {
          const updatedUser = await User.findOneAndUpdate({ email }, { token, lastLogin: new Date() });
          if(updatedUser) {
            const { lastLogin } = updatedUser;
            return res.send({ status: true, data: { email, lastLogin, token }, msg: 'Logged in successfully' });
          }
        }
      } else {
        return res.send({ status: false, msg: 'Please enter the correct email password!' });  
      }
    } else {
      return res.send({ status: false, msg: 'Please enter the correct email password!' });
    }

  } catch(err) {
    return res.send({ status: false, msg: err.message });
  }
});

module.exports = app;