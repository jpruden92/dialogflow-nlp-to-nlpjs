# Commands

1. ``node index.js train``

Gets dialogflow content and generates a NLP.js model that replicates its functionality. You need to export your Dialogflow service account as environment variable:

```sh
DIALOGFLOW_CREDENTIALS=my_json_credentials.json LANG=lang_code node index.js train
```

At the end, you will have a ``dialogflow_model.nlp`` on ``model`` folder.

2. ``node index.js use "text example"``

Uses your model to transform your text to intent.

3. ``node index.js test``

Allows to test a conversation using your model. Example:

```
Enter a text: hola
Result:
- [intent]: adf.smalltalk.hola
- [score]: 1.
Enter a text: que tal
Result:
- [intent]: adf.smalltalk.quetal
- [score]: 1.
Enter a text: cuentame un chiste
Result:
- [intent]: adf.smalltalk.chiste
- [score]: 1.
```

4. ``node index.js expose``

Exposes the model as REST API.

Here you have an example of request:

```
- Type: POST
- Endpoint: http://localhost:3000/resolve
- Body: { "text": "hola" }
- Header: Content-Type: application/json
```