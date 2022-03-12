const AiPlatformController = require('./ai-platform-controller');
const SpeechToTextController = require('./speech-to-text-controller');
const TextToSpeechController = require('./text-to-speech-controller');

// Express App Setup
const express = require('express');
const multer = require('multer');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const upload = multer();
const type = upload.single('audio');
const aiplatform = new AiPlatformController();
const speechToText = new SpeechToTextController();
const textToSpeech = new TextToSpeechController();

app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Express route handlers
app.get('/health', (req, res) => {
    res.send('ready');
});

app.get('/textclassification', async (req, res) => {
    const response = await aiplatform.predictTextClassification(req.query.text);

    console.log('Predict text classification response');
    console.log(`\tDeployed model id : ${response.deployedModelId}\n\n`);

    console.log('Prediction results:');

    for (const predictionResultValue of response.predictions) {
        const predictionResult =
            prediction.ClassificationPredictionResult.fromValue(
                predictionResultValue
            );

        for (const [i, label] of predictionResult.displayNames.entries()) {
            console.log(`\tDisplay name: ${label}`);
            console.log(`\tConfidences: ${predictionResult.confidences[i]}`);
            console.log(`\tIDs: ${predictionResult.ids[i]}\n\n`);
        }
    }

    res.status(201).send('everything is fine');
});

app.post('/transcription', type, async (req, res) => {
    try {
        const transcription = await getTranscription(req.file.buffer);

        res.send({data: transcription});
    } catch (e) {
        console.error(e);
        res.status(500);
    }
});

app.get('/speech', type, async (req, res) => {
    try {
        const speech = await getSpeech(req.query.text);

        res.send({audio: speech});
    } catch (e) {
        console.error(e);
        res.status(500);
    }
});

const getTranscription = async function(buffer) {
    const response = await speechToText.longRunningRecognize(buffer);
    return response.results
        .map(result => result.alternatives[0].transcript)
        .join('\n');
};

const getSpeech = async function(text) {
    const response = await textToSpeech.synthesizeSpeech(text);

    return response.audioContent;
};

app.listen(5000, err => {
    console.log('Listening');
});
