const nlpjs = require('./tools/nlp.js');

const readline = require('readline').createInterface({
    input: process.stdin,
    output: process.stdout
});

const express    = require('express');
const bodyParser = require('body-parser');
const app        = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

const option = process.argv[2];

const getText = () => {
    readline.question('Enter a text: ', text => {
        nlpjs.useNLP(text).then(response => {
            console.info(`Result:\n- [intent]: ${response.intent}\n- [score]: ${response.score}.`);
            getText();
        });
    });
}

const initWebhook = () => {
    const PORT = process.env.PORT || 3000;

    app.post('/resolve', (req, res) => {
        const { text } = req.body;

        nlpjs.useNLP(text).then(response => {
            res.send(response);
        });
    });

    app.listen(PORT, () => {
        console.info('Listening on PORT ' + PORT);
    })
}

switch (option) {
    case 'train':
        nlpjs.trainNLP();
        break;
    case 'use':
        const text = process.argv[3];

        if (!text) {
            console.info('Input text not found.');
            process.exit();
        }

        nlpjs.useNLP(text).then(response => {
            console.info(response);
        });

        break;
    case 'test':
        getText();
        break;
    case 'expose':
        initWebhook();
        break;
    default:
        console.info('Second parameter is required.');
        process.exit();
        break;
}
