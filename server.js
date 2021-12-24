const express = require('express');
const fs = require('fs');
const cors = require('cors');
const ytdl = require('ytdl-core');
const ytsr = require('ytsr');
const contentDisposition = require('content-disposition');

const ffmpegReencode = require('./services/complex-ffmpeg-reencode');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());

app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With');
    res.set("Access-Control-Expose-Headers", 'Content-Length');
    next();
});

app.get('/', (req, res) => {
    // TODO use api-key auth
    res.status(200).send();
})

app.get('/getInfo', async (req, res) => {
    try {
        let v_id = req.query.v_id;
        let info = await ytdl.getInfo(v_id);
        // info.formats = ytdl.filterFormats(info.formats, 'audioandvideo');
        let avilableFormats = [{ format: "mp3", quality: "audio", code: "audio" }];

        // let audioFormats = ytdl.filterFormats(info.formats, 'audioonly');

        info.formats.forEach(function (item) {
            if (item.qualityLabel != null) {

                ['codecs="', '"', ';', ','].map((y) => {
                    item.mimeType = item.mimeType.replace(y, '');
                });
                item.mimeType = (item.mimeType.length > 10) ? item.mimeType.substr(0, 10 - 1): item.mimeType, // remove the codex string

                avilableFormats.push({ format: item.mimeType, quality: item.qualityLabel, code: item.itag });
            }
        });

        res.send(avilableFormats);
    } catch (err) {
        console.log(err);
        res.status(500).send();
    }

});

app.get("/ytsr", async (req, res) => {
    try {
        let resultType = 'Video' || req.query.type;
        const filters1 = await ytsr.getFilters(req.query.term);
        const filter1 = filters1.get('Type').get(resultType);
        const searchResults = await ytsr(filter1.url);
        const items = [];

        for (i of searchResults.items) {
            i = {
                id: i.id,
                thumbnail: i.bestThumbnail.url,
                channelName: i.author.name,
                title: (i.title.length > 65) ? i.title.substr(0, 65 - 1) + '...' : i.title, // cut the title if too long
                longTitle: i.title,
            }
            items.push(i); 
        }

        res.send(items);

    } catch (e) {
        console.log(e);
    }


});

app.get('/download', async (req, res) => {
    try {
        var v_id = req.query.v_id;
        var formatCode = req.query.format;
        var YT_URL = `https://youtu.be/${v_id}`;
        let info = await ytdl.getInfo(v_id);

        if (formatCode === 'audio') {
            // 'attachment; filename="' 
            res.header('Content-Disposition', contentDisposition(info.videoDetails.title) + ".mp3");
            ytdl(YT_URL, { filter: 'audioonly' }).pipe(res);
        }else if(formatCode === '18'){
            res.header('Content-Disposition', contentDisposition(info.videoDetails.title) + ".mp4");
            let format = ytdl.chooseFormat(info.formats, { quality: formatCode });
            ytdl(YT_URL, { format }).pipe(res);
        }else{
            res.header('Content-Disposition', contentDisposition(info.videoDetails.title) + ".mp4");
            let format = ytdl.chooseFormat(info.formats, { quality: formatCode });
            ffmpegReencode(YT_URL, format, res);
        }

    } catch (err) {
        console.log(err);
        res.status(500).send();
    }
});


app.listen(PORT, () => {
    console.log('Listening on port ' + PORT + '...');
});
