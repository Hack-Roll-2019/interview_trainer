var sys   = require('sys'),
    spawn = require('child_process').spawn,
    dummy  = spawn('python', ['main.py', '/Users/jamesyaputra/Dekstop/video.mp4']);

dummy.stdout.on('data', function(data) {
    sys.print(data.toString());
});