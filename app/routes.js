const voice2text = require('./voice2text.js');
const fs = require('fs');

module.exports = (app, connection) => {
    app.get('/', (req, res) => {
        res.render("landing.ejs");
    });

    app.get('/signin', (req, res) => {
        res.render("signin.ejs");
    });

    app.get('/signup', (req, res) => {
        res.render("signup.ejs");
    });

    app.get('/interview/:id', (req, res) => {    
        const sql = `SELECT question FROM question WHERE questionid = ${req.params.id}`;
        
        connection.query(sql, (err, result) => {
            if (err) throw err;
            res.render("interview.html", {
                question: result
            })
        });


        
        // voice2text.transformVideoToText(req.query.url)
        // .then(transcript => {
        //     console.log("Done with promises");
        //     return voice2text.getGrammarCoefficient(transcript).then(coefficient => [coefficient, transcript]);
        // })
        // .then(arr => res.send(arr))
        // .catch(err => {
        //     console.error(err);
        // });

    });

    app.get('/results', (req, res) => {

    })

}   