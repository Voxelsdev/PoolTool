// eslint-disable-next-line new-cap
'use strict';

const express = require('express');
const app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server);

server.listen(8080);

const knex = require('knex');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const path = require('path');

const webpack = require('webpack');
const config = require('./webpack.config.dev');
const compiler = webpack(config);

const passport = require('passport');
const rp = require('request-promise');

const rooms = {};

function handleUse(data) {
  const { roomId, roomAmount, roomHealth, userId, toolId, toolTier } = data;
  const currentHealth = rooms[roomId].currentHealth;
  let percent = toolTier / roomHealth;
  const poolAmount = rooms[roomId].currentAmount;

  percent = percent > 1 ? 1 : percent;

  if (currentHealth - toolTier > 0) {
    rooms[roomId].currentHealth -= toolTier;
    rooms[roomId].users[userId].reward += Math.round(poolAmount * percent);
    rooms[roomId].currentAmount -= Math.round(poolAmount * percent);

    const toSend = {
      currentHealth: rooms[roomId].currentHealth,
      currentAmount: rooms[roomId].currentAmount,
      reward: rooms[roomId].users[userId].reward,
      numPlayers: Object.keys(rooms[roomId].users).length,
    };

    io.sockets.in(roomId).emit('new information', toSend);

  } else {
    rooms[roomId].currentHealth = 0;
    rooms[roomId].users[userId].reward += poolAmount;
    rooms[roomId].currentAmount = 0;

    const toSend = {
      currentHealth: rooms[roomId].currentHealth,
      currentAmount: rooms[roomId].currentAmount,
      reward: rooms[roomId].users[userId].reward,
      numPlayers: Object.keys(rooms[roomId].users).length,
    };

    io.sockets.in(roomId).emit('new information', toSend);
  }
}

io.on('connection', (socket) => {
  socket.on('room', (room) => {
    socket.join(room);

    socket.in(room).on('tool used', (data) => {
      const { roomId, roomAmount, roomHealth, userId, toolId, toolTier } = data;
      if (!rooms[roomId]) {
        rooms[roomId] = {
          currentHealth: roomHealth,
          currentAmount: roomAmount,
          users: {},
        }
        rooms[roomId].users[userId] = {};
        const userInRoom = rooms[roomId].users[userId];

        userInRoom.toolsUsed = {};
        userInRoom.toolsUsed[toolId] = { durabilityUsed: 1 };
        userInRoom.reward = 0;

        handleUse(data);
      } else {
        if (!rooms[roomId].users[userId]) {
          rooms[roomId].users[userId] = {
            toolsUsed: {},
            reward: 0,
          }
          rooms[roomId].users[userId].toolsUsed[toolId] = { durabilityUsed: 1 };

          handleUse(data);
        } else {
          if (!rooms[roomId].users[userId].toolsUsed[toolId]) {
            rooms[roomId].users[userId].toolsUsed[toolId] = { durabilityUsed: toolTier };

            handleUse(data);
          } else {
            handleUse(data);
          }
        }
      }
    });
  });

  socket.on('leave', (room) => {
    socket.leave(room);
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
