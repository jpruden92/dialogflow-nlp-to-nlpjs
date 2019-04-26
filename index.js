const { google } = require('googleapis');
const { NlpManager } = require('node-nlp');
 
const manager = new NlpManager({ languages: ['es'] });

const scopes = require('./scopes.json');
const agentsCredentials = require('./credentials.json');

const projectId = agentsCredentials.project_id;

const jwtClient = new google.auth.JWT(agentsCredentials.client_email, null, agentsCredentials.private_key, scopes);

google.options({
    auth: jwtClient
});

const dialogflowClient = google.dialogflow('v2');
const intentsClient = dialogflowClient.projects.agent.intents;
const sessionClient = dialogflowClient.projects.agent.sessions;

const getIntentsList = () => {
    return new Promise((resolve, reject) => {
        intentsClient.list({
            parent: `projects/${projectId}/agent`,
            intentView:'INTENT_VIEW_FULL'
        }).then(dialogflowIntents => {
            const intents = dialogflowIntents.data.intents;
            resolve(intents);
        });
    });
}

const getIntent = intentName => {
    return new Promise((resolve, reject) => {
        intentsClient.get({
            name: intentName
        }).then(intentData => {
            resolve(intentData);
        });
    });
}

const intentToDM = dialogflowIntent => {
    const dm = {
        intent: null,
        trainingPhrases: [],
        responses: []
    };

    dm.intent = dialogflowIntent.displayName;
    dialogflowIntent.trainingPhrases.forEach(phrase => {
        let text = '';

        phrase.parts.forEach(part => {
            text += part.text;
        });

        dm.trainingPhrases.push(text);
    });

    if (dialogflowIntent.messages[0].text.text) dm.responses = dialogflowIntent.messages[0].text.text;

    return dm;
}
/*
getIntentsList().then(intentsList => {
    intentsList.forEach(intentData => {
        intentData = intentToDM(intentData);

        intentData.trainingPhrases.forEach(trainingPhrase => {
            manager.addDocument('es', trainingPhrase, intentData.intent);
        });

        intentData.responses.forEach(respose => {
            manager.addAnswer('es', intentData.intent, respose);
        });
    });

    (async() => {
        await manager.train();
        manager.save();
        const response = await manager.process('es', 'adios');
        console.log(response);
    })();
});
*/
(async() => {
    manager.load('model.nlp');
    const response = await manager.process('es', 'que comes');
    console.log(response);
})();