const express = require('express'); 
const cors = require('cors');
const monk = require('monk');
const Filter = require('bad-words');
const rateLimit = require("express-rate-limit");

const db = monk(process.env.MONGO_URI || 'localhost/twooter'); // connect to monk database twooter on local machine
const twoots = db.get('twoots');
const filter = new Filter();

const app = express();

app.use(cors()); // using cors to allow access to everybody requesting
app.use(express.json()); // json body parser

app.get('/', (req, res) => {
    res.json({
        message: 'Twooter! wowzers!!'
    });
});

app.get('/twoots', (req, res) => {
   twoots
        .find()
        .then(twoots => {
            res.json(twoots);
        });
    });

function isValidTwoot(twoot) {
    return twoot.name && twoot.name.toString().trim() !== '' &&
            twoot.content && twoot.content.toString().trim() !== '';
}

app.use(rateLimit({
    windowMs: 10*1000, //30 seconds
    max: 1
}));


app.post('/twoots', (req, res) => {
    if(isValidTwoot(req.body)) {
        //insert into db
        const twoot = {
            
            name: filter.clean(req.body.name.toString()),
            content: filter.clean(req.body.content.toString()),
            created: new Date()
        };
        twoots
            .insert(twoot)
            .then(createdTwoot => {
                res.json(createdTwoot);
            });
        
        //console.log(twoot);
    } else {
        res.status(422);
        res.json({
            message: 'Hey! name and content are required'
        });
    }
    
    //console.log(req.body);
});


app.listen(5000, () => {
    console.log('Listening on http://localhost:5000');
}); 