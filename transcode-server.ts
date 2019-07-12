const express = require('express');
const app = express();
const port = 3000;

const ffprobePath = require('@ffprobe-installer/ffprobe').path.replace('app.asar', 'app.asar.unpacked');
const ffmpegPath = require('@ffmpeg-installer/ffmpeg').path.replace('app.asar', 'app.asar.unpacked');
const spawn = require('child_process').spawn;

app.get('/', (req, res) => {
    const seekTime = req.query.seek || 0;
    const file = req.query.file || '';
    // see https://trac.ffmpeg.org/wiki/Encode/H.264#a2.Chooseapreset for more options
    const ffmpeg = spawn(ffmpegPath, [
      '-ss', seekTime,
      '-i', file,
      '-f', 'mp4',
      '-crf', '17',
      '-preset', 'ultrafast',
      '-movflags', 'frag_keyframe+empty_moov+faststart',
      '-frag_duration', '3600',
      'pipe:1'
    ]);
    res.writeHead(200, {
      'Content-Type': 'video/mp4'
    });
    ffmpeg.stdout.pipe(res);
    // error logging
    ffmpeg.stderr.setEncoding('utf8');
    ffmpeg.stderr.on('data', (data) => {
        console.log(data);
    });
  }
);

app.listen(port, () => console.log(`Transcode server listening on port ${port}!`));
