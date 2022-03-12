function TextToSpeechController() {
    // Imports the Google Cloud client library
    const textToSpeech = require('@google-cloud/text-to-speech');

    // Instantiates a client
    const client = new textToSpeech.TextToSpeechClient();
    const languageCode = 'en-US';
    const ssmlGender = 'NEUTRAL';
    const audioEncoding = 'MP3';

    async function synthesizeSpeech(text) {

        // Construct the request
        const request = {
            input: {text},
            // Select the language and SSML voice gender (optional)
            voice: {languageCode, ssmlGender},
            // select the type of audio encoding
            audioConfig: {audioEncoding},
        };

        // Performs the text-to-speech request
        const [response] = await client.synthesizeSpeech(request);

        return response;
    }

    return {
        synthesizeSpeech,
    };
}

module.exports = TextToSpeechController;