/**
 * Reencode audio & video without creating files first
 */

// Buildin with nodejs
const fs = require('fs');
const cp = require('child_process');
const readline = require('readline');
// External modules
const ytdl = require('ytdl-core');
const ffmpeg = require('ffmpeg-static');

module.exports = function ffmpegReencode(ref, format, res) {
    console.log("start ffmpeg");

    // Get audio and video stream going
    const audio = ytdl(ref, { filter: 'audioonly', quality: 'highestaudio' });
    const video = ytdl(ref, { format });

    // Start the ffmpeg child process
    const ffmpegProcess = cp.spawn(ffmpeg, [
        // Remove ffmpeg's console spamming
        '-loglevel', '0', '-hide_banner',
        // 3 second audio offset
        '-itsoffset', '3.0', '-i', 'pipe:3',
        '-i', 'pipe:4',
        // Rescale the video
        '-vf', 'scale=320:240',
        // Choose some fancy codes
        '-c:v', 'libx265', '-x265-params', 'log-level=0',
        '-c:a', 'flac',
        // Define output container
        '-f', 'matroska', 'pipe:5',
    ], {
        windowsHide: true,
        stdio: [
            /* Standard: stdin, stdout, stderr */
            'inherit', 'inherit', 'inherit',
            /* Custom: pipe:3, pipe:4, pipe:5 */
            'pipe', 'pipe', 'pipe',
        ],
    });

    // Link streams
    // FFmpeg creates the transformer streams and we just have to insert / read data
    audio.pipe(ffmpegProcess.stdio[3]);
    video.pipe(ffmpegProcess.stdio[4]);
    ffmpegProcess.stdio[5].pipe(res);
}