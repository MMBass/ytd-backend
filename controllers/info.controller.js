const ytdl = require('ytdl-core');
const { customCutString } = require('../utils');

const getInfo = async (req, res) => {
    try {
        let v_id = req.query.v_id;
        let info = await ytdl.getInfo(v_id);
        let avilableFormats = [{ format: "mp3", quality: "audio", code: "audio" }];

        info.formats.forEach(function (item) {
            if (item.qualityLabel != null) {

                ['codecs="', '"', ';', ','].map((y) => {
                    item.mimeType = item.mimeType.replace(y, '');
                });
                item.mimeType =  customCutString(item.mimeType, 11), // remove the codex string

                avilableFormats.push({ format: item.mimeType, quality: item.qualityLabel, code: item.itag });
            }
        });

        res.send(avilableFormats);
    } catch (err) {
        console.log(err);
        res.status(500).send();
    }

}

module.exports = { getInfo };