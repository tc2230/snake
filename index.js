// const fs = require('fs');

const path = require('path');
const express = require('express');
// const redis = require("ioredis");
// const { v4: uuidv4 } = require('uuid');

// init
// server / socket
const app = express();
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '/app/views')); // set serving path
const server = require('http').Server(app);
// const io = require('socket.io')(server);

// serve static file folder to express server
app.use(express.static(path.join(__dirname, 'app')));

// redis
// const redis_client = new redis({
//     port: 6379,
//     host: "127.0.0.1",
// });
// const redis_pipeline = redis_client.pipeline();

// postgres
// const db = require("./app/models");
// db.sequelize.sync({ force: true })
// .then(() => {
//     console.log('Drop and Resync Database with { force: true }');
// })
// .catch((err) => {
//     console.log(err);
// });

// create message in database and cache
// async function process_msg(msg) {
//     id = uuidv4();
//     timestamp = Date.parse(msg.timestamp);
//     // redis_pipeline.lpush('chatroom:0:msg', JSON.stringify(msg)); // save to redis buffer

//     await db.message.create(msg);
//     // await redis_pipeline.exec();
// }

// async function update_cache() {};

// add visitor count
// let onlineCount = 0;

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/app/views/index.html');
});

// app.get('/', (req, res) => {
//     res.render('index', {
//       cookiesScript: fs.readFileSync('app/scripts/cookies.js', 'utf8'),
//       chatroomScript: fs.readFileSync('app/scripts/chatroom.js', 'utf8')
//     });
//   });

// io.on('connection', (socket) => {
//     // add count
//     onlineCount += 1;

//     // update onlineCount
//     io.emit("online", onlineCount);

//     // print Hello on server side
//     console.log('Greetings!');

//     // 接收來自前端的 greet 事件
//     socket.on("greet", () => {
//         socket.emit("greet", "Hi! Client Test by fu."); // 然後回送 greet 事件，並附帶內容
//     });

//     // listen messages send
//     socket.on("send", (msg) => {
//         // broadcast to main board
//         console.log(msg);
//         io.emit("msg", msg);

//         // send message to database pipeline
//         process_msg(msg);
//     });

//     // 當發生離線事件
//     socket.on('disconnect', () => {
//         // decrease count
//         onlineCount = (onlineCount < 0) ? 0 : onlineCount-=1;
//         // update count
//         io.emit("online", onlineCount);

//         // print Farewell on server side
//         console.log('Farewell.');
//     });

// });

// serve static file folder to express server
// app.use(express.static(path.join(__dirname, 'app/public')));

// 注意，這邊的 server 原本是 app
server.listen(5504, '0.0.0.0', () => {
  console.log('Server Started. http://0.0.0.0:5504');
});
