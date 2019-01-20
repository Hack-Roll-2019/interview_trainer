module.exports.listen =  (path, callback) => {
    var sys   = require('sys'),
        spawn = require('child_process').spawn,
        //dummy  = spawn('python', ['main.py', '/Users/jamesyaputra/Desktop/video.mp4']);
        dummy = spawn('python', ['main.py', path]);

    let coefficient = '';

     dummy.stdout.on('data', function(data) {
        coefficient += data.toString();
        //console.log(data.toString());
    });

     dummy.on('close', function(code) {
        console.log("Coefficient: " + coefficient);
        return callback(coefficient);
    });
}

//console.log(listen(code => code))
