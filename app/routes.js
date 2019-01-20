const voice2text = require('./voice2text.js');
const emotionRecognition = require('../openCV/listen.js');
const fs = require('fs');

module.exports = (app) => {
    app.get('/', (req, res) => {
        res.render("landing.ejs");
    });

    app.get('/signin', (req, res) => {
        res.render("signin.ejs");
    });

    app.get('/signup', (req, res) => {
        res.render("signup.ejs");
    });

    app.get('/interview/:id', async (req, res) => {    
        const url = req.query.url;

        let coefficient = ''
        emotionRecognition.listen("/Users/jamesyaputra/Desktop/video.mp4", data => {
            while (data == null) {
                setTimeout(data, 500)
            }
            console.log("done")
            coefficient = data;


            voice2text.transformVideoToText(req.query.url)
            .then(transcript => {
                console.log("Done with promises");
                return voice2text.getGrammarCoefficient(transcript).then(coefficient => [coefficient, transcript]);
            })
            .then(arr => res.send(arr))
            .catch(err => {
                console.error(err);
            });
        });
        
        

    });

    app.get('/results', (req, res) => {

    })

}   