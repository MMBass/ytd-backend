const express = require('express');
const fs = require('fs');
const cors = require('cors');
const ytdl = require('ytdl-core');
const ytsr = require('ytsr');
const contentDisposition = require('content-disposition');

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
    // TODO use api-kkey auth
    res.status(200).send();
})

app.get('/getInfo', async (req, res) => {
    try {
        let v_id = req.query.v_id;
        let info = await ytdl.getInfo(v_id);
        let avilableFormats = [{ format: "mp3", quality: "audio", code: "audio" }];

        let audioFormats = ytdl.filterFormats(info.formats, 'audioonly');

        info.formats.forEach(function (item) {
            // && item.mimeType.indexOf('mp4') >= 0
            if (item.qualityLabel != null) {

                ['codecs="', '"', ';', ','].map((y) => {
                    item.mimeType = item.mimeType.replace(y, '');
                });

                avilableFormats.push({ format: item.mimeType, quality: item.qualityLabel, code: item.itag });
            }
        });

        res.send(avilableFormats);
    } catch (err) {
        console.log(err);
        res.status(500).send();
    }

});

app.get('/download', async (req, res) => {
    try {
        var v_id = req.query.v_id;
        var formtCode = req.query.format;
        var YT_URL = `https://youtu.be/${v_id}`;
        let info = await ytdl.getInfo(v_id);

        if (formtCode === 'audio') {
            // 'attachment; filename="' 
            res.header('Content-Disposition', contentDisposition(info.videoDetails.title) + ".mp3");
            ytdl(YT_URL, { filter: 'audioonly' }).pipe(res);
        } else {
            res.header('Content-Disposition', contentDisposition(info.videoDetails.title) + ".mp4");
            let format = ytdl.chooseFormat(info.formats, { quality: formtCode });
            ytdl(YT_URL, { format }).pipe(res);
        }

    } catch (err) {
        console.log(err);
        res.status(500).send();
    }
});

app.get("/ytsr", async (req, res) => {
    const filters1 = await ytsr.getFilters(req.query.term);
    const filter1 = filters1.get('Type').get('Video');
    const searchResults = await ytsr(filter1);
    const items = searchResults.items;

    res.send(items);
});

app.listen(PORT, () => {
    console.log('Listening on port ' + PORT + '...');
});
