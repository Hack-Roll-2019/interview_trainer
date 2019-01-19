var sys   = require('sys'),
    spawn = require('child_process').spawn,

    // directory naming should be fixed to allow for both Windows and Mac
    // video directory should be replaced with var containing video link
    dummy  = spawn('python', ['openCV/main.py', '/Users/jamesyaputra/Dekstop/video.mp4']);

dummy.stdout.on('data', function(data) {
    // Do anything with the data variable
});