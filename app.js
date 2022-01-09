const express = require('express');
const http = require('http');
const { Server } = require("socket.io");
const cors = require('cors');
const helmet = require('helmet');

const indexRouter = require('./routes/index.router.js');
const infoRouter = require('./routes/info.router.js');
const ytsrRouter = require('./routes/ytsr.router.js');
const downloadRouter = require('./routes/download.router.js');
const authMiddleware = require('./middleware/auth.js');

const app = express();
const server = http.createServer(app);
global.io = new Server(server,{
    cors: {
      origin: "*",
      methods: ["GET", "POST"],
      allowedHeaders: ["access-token"],
      credentials: true
    }
});

const PORT = process.env.PORT || 5000;

app.use(helmet());

app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With');
    res.set("Access-Control-Expose-Headers", 'Content-Length');
    next();
});

app.use(cors({
    exposedHeaders: ['access-token']
}));

app.use('/', authMiddleware, indexRouter);
app.use('/info', authMiddleware, infoRouter);
app.use('/ytsr', authMiddleware, ytsrRouter);
app.use('/download', authMiddleware, downloadRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handler
app.use(function (err, req, res, next) {
    console.error(err.stack);
    res.status(err.status || 500).send({ message: err.message });
})

server.listen(PORT, console.log('Listening on port ' + PORT + '...'));

module.exports = { io:'dkjsl' };