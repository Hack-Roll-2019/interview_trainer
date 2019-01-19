module.exports.main = path => {
    console.log("runniung chukd oricess");
    
    
    const spawn = require('child_process').spawn,
    dummy  = spawn('python', ['/Users/jamesyaputra/Workspace/HackRoll/interview_trainer/openCV/main.py', path]);

    return dummy.stdout.on('data', data => console.log(data.toString()));
}
