const util = require('util');
const fs = require('fs');
const axios = require('axios');


const questions = 

module.exports.getRandomQuestion = () => {
    
}

module.exports.transformVideoToText = async function (path) {
    process.env.GOOGLE_APPLICATION_CREDENTIALS = "/Users/jamesyaputra/Workspace/HackRoll/excelinterviewhackandroll-e46c529cca7b.json";
    
    // Imports the Google Cloud Video Intelligence library
    const videoIntelligence = require('@google-cloud/video-intelligence');

    // Creates a client
    const client = new videoIntelligence.VideoIntelligenceServiceClient();

    //const path = "../Interview Tips - The Top 5 Job Interview Tips You NEED To Pay Attention To.mp4"

    const readFile = util.promisify(fs.readFile);
    const file = await readFile(path);
    const inputContent = file.toString('base64');    

    const videoContext = {
        speechTranscriptionConfig: {
            languageCode: 'en-US',
            enableAutomaticPunctuation2: true,
        },
    };

    const request = {
        inputContent: inputContent,
        features: ['SPEECH_TRANSCRIPTION'],
        videoContext: videoContext,
    };

    const [operation] = await client.annotateVideo(request);
    console.log('Waiting for operation to complete...');
    const [operationResult] = await operation.promise();
    console.log('Operation completed');

    const alternative =
    operationResult.annotationResults[0].speechTranscriptions[0]
        .alternatives[0];

    // alternative.words.forEach(wordInfo => {
    //     const start_time =
    //         wordInfo.startTime.seconds + wordInfo.startTime.nanos * 1e-9;
    //     const end_time = wordInfo.endTime.seconds + wordInfo.endTime.nanos * 1e-9;
    //     console.log('\t' + start_time + 's - ' + end_time + 's: ' + wordInfo.word);
    // });

    return alternative.transcript;
}

module.exports.getGrammarCoefficient = async function (message) {
    const apiKey = "G5N6SFwKo6XOhNms";
    
    return await axios.get("https://api.textgears.com/check.php" , {
        params: {
            text: message,
            api: apiKey
        }
    })
    .then(res => {
        const errorCount = res.data.errors.length;
        console.log("Message" + message)
        console.log(errorCount);
        const numWords = message.split(' ').length;
        console.log("Calculating gramar coefficient:  " + (errorCount/numWords).toPrecision(3));
        
        return (errorCount/numWords).toPrecision(3);
    })
    .catch(err => console.log(err))

}

