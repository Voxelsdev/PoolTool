// eslint-disable-next-line new-cap
'use strict';

const express = require('express');
const app = express();
const server = require('http').createServer(app);
const io = require('socket.io')(server);
console.log(io.sockets.on.toString());
const knex = require('knex');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const path = require('path');

const webpack = require('webpack');
const config = require('./webpack.config.dev');
const compiler = webpack(config);

const passport = require('passport');

io.sockets.on('connection', (socket) => {
  socket.on('room', (room) => {
    socket.join(room);
    socket.in(room).on('message', (data) => {
      console.log(data);
    });
  });
});

app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}

const port = process.env.PORT || 3000;

app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((user, done) => {
  done(null, user);
});

app.use(require('webpack-dev-middleware')(compiler, {
  noInfo: true,
  publicPath: config.output.publicPath
}));

app.use(require('webpack-hot-middleware')(compiler));

app.use('/dist', express.static('dist'));

const auth = require('./routes/auth');
const inventory = require('./routes/inventory');
const store = require('./routes/store');
const pool = require('./routes/pools');

app.use('/auth', auth);
app.use('/users', inventory);
app.use('/store', store);
app.use('/markers', pool);

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(port, err => {
  if (err) {
    console.log(err);
    return;
  }

  console.log('Listening on port: ' + port);
});
