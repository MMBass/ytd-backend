const contentDisposition = require('content-disposition');
const ytdl = require('ytdl-core');

let tempSocket = undefined;

setTimeout(() => {
  global.io.on('connection', (socket) => {
    tempSocket = socket;
    socket.emit('listContinue', 'listContinue');
  });
}, 2000); // let the server (app.js) start before global io declaredd

module.exports = function playlistLoop(req, res, YT_URL) {
  res.header('Content-Disposition', contentDisposition(req.query.title) + ".mp3");
  ytdl(YT_URL, { filter: 'audioonly' })
    .pipe(res)
    .on('finish', () => {
      if (req.query.index === 'last') {
        tempSocket.emit('listFinish', 'listFinish');
        io.disconnect();
        io = undefined;
      }
      tempSocket.emit('listContinue', 'listContinue');
    })
    .on('error', () => {
      if (req.query.index === 'last') {
        tempSocket.emit('listFinish', 'listFinish with error');
        io.disconnect();
        io = undefined;
      }
      tempSocket.emit('listContinue', 'listContinue with error');
    });
}