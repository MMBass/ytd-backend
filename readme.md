# About 
Personal  YT videos downloader
using ytdl-core
filter music videos for music mode
playlist download option by one requst not avilable yet

# API

## Call the server for start

### Request

`GET /`

    headers:{
        'x-api-key': google-api-key
    }

### Response

    HTTP/1.1 200 OK
    Status: 200 OK
    Connection: close

    headers:{
        'access-token': access-token
    }

## Get term serach results 

### Request

`GET /ytsr/`

    '?term=str&type=str'

    headers:{
        'x-access-token': token
    }

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

    headers:{
        'x-access-token': token
    }

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

    '?v_id=str&format=166&accessToken=token'

### Response

    HTTP/1.1 200
    Connection: close
    Content-Type: video/audio
    Content-Disposition: attachment; filename=...mp4/webm/mp3
