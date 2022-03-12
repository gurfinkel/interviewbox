function SpeechToTextController() {
    const speech = require('@google-cloud/speech');

    // Instantiates a client
    const client = new speech.SpeechClient();
    const encoding = 'WAV';
    const sampleRateHertz = 48000;
    const languageCode = 'en-US';

    async function longRunningRecognize(buffer) {
        // const filename = 'Local path to audio file, e.g. /path/to/audio.raw';
        // const encoding = 'Encoding of the audio file, e.g. LINEAR16';
        // const sampleRateHertz = 16000;
        // const languageCode = 'BCP-47 language code, e.g. en-US';
        const config = {
            encoding,
            sampleRateHertz,
            languageCode,
        };

        /**
         * Note that transcription is limited to 60 seconds audio.
         * Use a GCS file for audio longer than 1 minute.
         */
        const audio = {
            content: Buffer.from(buffer).toString('base64'),
        };

        const request = {
            config: config,
            audio: audio,
        };

        // Detects speech in the audio file. This creates a recognition job that you
        // can wait for now, or get its result later.
        const [operation] = await client.longRunningRecognize(request);

        // Get a Promise representation of the final result of the job
        const [response] = await operation.promise();

        return response;
    }

    return {
        longRunningRecognize: longRunningRecognize,
    };
}

module.exports = SpeechToTextController;