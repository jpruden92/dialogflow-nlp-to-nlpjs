const dialogflow = require('./dialogflow.js');
const fs = require('fs');

const { NlpManager } = require('node-nlp');

const lang = process.env.LANG || 'es';
const manager = new NlpManager({ languages: [lang] });

const NLP_MODEL_PATH = __dirname + '/../model/dialogflow_model.nlp';

if (!fs.existsSync(NLP_MODEL_PATH)) {
    console.info('NLP.js model doesn\'t exist. Please train the system before.');
} else {
    console.info('Loading NLP.js model from ' + NLP_MODEL_PATH);
    manager.load(NLP_MODEL_PATH);
    console.info('NLP.js model loaded.');
}

const trainNLP = () => {
    return new Promise((resolve, reject) => {
        console.info('Training NLP.js model.');
        dialogflow.getIntentsList().then(intentsList => {
            intentsList.forEach(intentData => {
                intentData = dialogflow.intentToDM(intentData);

                intentData.trainingPhrases.forEach(trainingPhrase => {
                    manager.addDocument(lang, trainingPhrase, intentData.intent);
                });

                intentData.responses.forEach(response => {
                    manager.addAnswer(lang, intentData.intent, response);
                });
            });

            manager.train().then(() => {
                console.info('NLP.js model trained.');
                manager.save(NLP_MODEL_PATH);
                resolve();
            });
        });
    });
}

const useNLP = userInput => {
    return new Promise((resolve, reject) => {
        manager.process(lang, userInput).then(response => {
            resolve(response);
        });
    });
}

module.exports = {
    trainNLP,
    useNLP
}