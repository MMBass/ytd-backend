const express = require('express');
const fs = require('fs');
const cors = require('cors');
const ytdl = require('ytdl-core');
const ytsr = require('ytsr');

const app = express();
const PORT = process.env.PORT||5000;

app.use(cors());

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With');
  res.set("Access-Control-Expose-Headers", 'Content-Length');
  next();
});

app.get('/',(req, res)=>{
    // TODO use api-kkey auth
    res.status(200).send();
})

app.get('/getInfo',async (req,res)=>{
    try{
        let v_id = req.query.v_id;
        let info = await ytdl.getInfo(v_id);
        let avilableFormats = [{format:"mp3",quality:"audio",code:"audio"}];
    
        let audioFormats = ytdl.filterFormats(info.formats, 'audioonly');

        info.formats.forEach(function(item) {  
            // && item.mimeType.indexOf('mp4') >= 0
            if(item.qualityLabel != null ){
                item.mimeType = item.mimeType.replace('codecs="','');
                item.mimeType = item.mimeType.replace('"','');
                item.mimeType = item.mimeType.replace(';','');

                avilableFormats.push({format:item.mimeType,quality:item.qualityLabel,code:item.itag});
            } 
        });

        res.send(avilableFormats);
    }catch (err){
        console.log(err);
        res.status(500).send();
    }

});

app.get('/download',async (req,res)=>{
    try{
       
        var v_id = req.query.v_id;
        var formtCode = req.query.format;
        var YT_URL = `https://youtu.be/${v_id}`;
        let info = await ytdl.getInfo(v_id);

        if(formtCode === 'audio'){ 
            res.header('Content-Disposition', 'attachment; filename="'+info.videoDetails.title+'.mp3"');
            ytdl(YT_URL, { filter: 'audioonly'}).pipe(res);
        }else{
            res.header('Content-Disposition', 'attachment; filename="'+info.videoDetails.title+'.mp4"');
            let format = ytdl.chooseFormat(info.formats, { quality: formtCode });
            ytdl(YT_URL,{format}).pipe(res);
        }   
    
    }catch (err){
        console.log(err);
        res.status(500).send();
    }
});

app.get("/ytsr",async (req,res)=>{
    const searchResults = await ytsr(req.query.term);
    const items = searchResults.items;
    console.log(items);
    for(i in items){

        if(items[i].type != 'video') items.splice(items[i],1); 
        items[i].id = {videoId: items[i].id};
        console.log( items[i].id);
    }
    res.send(items);
});

app.listen(PORT, () => {
    console.log('Listening on port '+PORT +'...');
});
