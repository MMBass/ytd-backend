# About 
Personal  YT videos downloader
using ytdl-core
filter music videos for music mode
playlist download option by one requst not avilable yet

# API

## Call the server for start

### Request

`GET /`

### Response

    HTTP/1.1 200 OK
    Status: 200 OK
    Connection: close

## Get term serach results 

### Request

`GET /ytsr/`

    '?term=str&type=str'

### Response

    HTTP/1.1 200
    Connection: close
    Content-Type: application/json

    { 
        id: str,
        thumbnail: url,
        channelName: str,
        title: str, 
        longTitle: str
    }

### Request

`GET /info/`

    '?v_id=str'

### Response

    HTTP/1.1 200
    Connection: close
    Content-Type: application/json

    { 
        [
            format: mimeType,
            quality: qualityLabel,
            code: itag 
        ]
      
    }

### Request

`GET /download/`

    '?v_id=str&format=166'

### Response

    HTTP/1.1 200
    Connection: close
    Content-Type: video/audio
    Content-Disposition: attachment; filename=...mp4/webm/mp3
