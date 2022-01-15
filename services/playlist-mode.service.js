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

  let tempYtdl;

  // let tempInterval;

  // function trackFinish() {
  //   tempInterval = setInterval(() => {
  //     if (tempYtdl) {
  //       if (tempYtdl.finished) {
  //         clearInterval(tempInterval);
  //         setTimeout(() => {
  //           if (req.query.index === 'last') {

  //             tempSocket.emit('listFinish', 'listFinish');
  //           }
  //           tempSocket.emit('listContinue', 'listContinue');
  //         }, 500);
  //       }
  //     }
  //   }, 100);
  // }

  tempYtdl = ytdl(YT_URL, { filter: 'audioonly' })
    .pipe(res)
    .on('unpipe', (src) => {
      console.log('unpipe')
      // trackFinish();
      if (req.query.index === 'last') {

        tempSocket.emit('listFinish', 'listFinish');
      }
      tempSocket.emit('listContinue', 'listContinue');
    })
    .on('finish', (src) => {
      console.log('finish')
    })
    .on('close', (src) => {
      console.log('close')
    })
    .on('error', () => {
      if (req.query.index === 'last') {
        tempSocket.emit('listFinish', 'listFinish with error');
      }
      tempSocket.emit('listContinue', 'listContinue with error');
    });
}