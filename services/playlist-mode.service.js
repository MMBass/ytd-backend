const contentDisposition = require('content-disposition');
const ytdl = require('ytdl-core');

let tempSocket = undefined;

  // before:
  // ,[Symbol(kHandle)]: null,
  // after:
  // , [Symbol(kHandle)]: [TCP],

setTimeout(() => {
  global.io.on('connection', (socket) => {
    tempSocket = socket;
    socket.emit('listContinue', 'listContinue');
  });
}, 2000); // let the server (app.js) start before global io declaredd

module.exports = function playlistLoop(req, res, YT_URL) {
  res.header('Content-Disposition', contentDisposition(req.query.title) + ".mp3");

  let tempYtdl;
  let tempInterval;

  function trackFinish() {
    tempInterval = setInterval(() => {
      if (tempYtdl) {
        if (tempYtdl.finished) {
          clearInterval(tempInterval);
          setTimeout(() => {
            if (req.query.index === 'last') {

              tempSocket.emit('listFinish', 'listFinish');
            }
            tempSocket.emit('listContinue', 'listContinue');
          }, 500);
        }
      }
    }, 100);
  }
 
  setInterval(() => {
    if(tempYtdl){
      if(tempYtdl.req){
        var syms = Object.getOwnPropertySymbols(tempYtdl.req).find(function(sym) {
          return String(sym) === "Symbol(kHandle)";
        });
        console.log('tempYtdl.req[syms] : ' + tempYtdl.req[syms]);
        console.log('tempYtdl.req[syms][0] : ' + tempYtdl.req[syms][0]);
      }
    }
  }, 1000);

  tempYtdl = ytdl(YT_URL, { filter: 'audioonly' })
    .pipe(res)
    .on('close', () => {
      // console.log(tempYtdl)
      trackFinish();
    })
    .on('error', () => {
      if (req.query.index === 'last') {
        tempSocket.emit('listFinish', 'listFinish with error');
      }
      tempSocket.emit('listContinue', 'listContinue with error');
    });
}