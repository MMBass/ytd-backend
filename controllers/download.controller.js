const contentDisposition = require('content-disposition');
const ytdl = require('ytdl-core');
const ffmpegReencode = require('../services/complex-ffmpeg-reencode.service');
const playlistLoop = require('../services/playlist-mode.service');

const download = async (req, res) => {
    try {
        var v_id = req.query.v_id;
        var formatCode = req.query.format;

        var YT_URL = `https://youtu.be/${v_id}`;

        let info;

        if(req.query.type === 'list'){
            playlistLoop(req, res, YT_URL)
        }else if (formatCode === 'audio') {
            info = await ytdl.getInfo(v_id);
            res.header('Content-Disposition', contentDisposition(info.videoDetails.title) + ".mp3");
            ytdl(YT_URL, { filter: 'audioonly' }).pipe(res);
        } else if (formatCode === '18') {
            info = await ytdl.getInfo(v_id);
            res.header('Content-Disposition', contentDisposition(info.videoDetails.title) + ".mp4");
            let format = ytdl.chooseFormat(info.formats, { quality: formatCode });
            ytdl(YT_URL, { format }).pipe(res);
        } else {
            info = await ytdl.getInfo(v_id);
            res.header('Content-Disposition', contentDisposition(info.videoDetails.title) + ".mp4");
            let format = ytdl.chooseFormat(info.formats, { quality: formatCode });
            ffmpegReencode(YT_URL, format, res);
        }

    } catch (err) {
        console.log(err);
        res.status(500).send();
    }
};

module.exports = { download };