function AiPlatformController() {
    const keys = require('./../keys');
    const aiplatform = require('@google-cloud/aiplatform');

    const {instance, prediction} =
            aiplatform.protos.google.cloud.aiplatform.v1.schema.predict;

    // Imports the Google Cloud Model Service Client library
    const {PredictionServiceClient} = aiplatform.v1;

    // Specifies the location of the api endpoint
    const clientOptions = {
        apiEndpoint: 'us-central1-aiplatform.googleapis.com',
    };

    // Instantiates a client
    const predictionServiceClient = new PredictionServiceClient(clientOptions);

    async function predictTextClassification(text) {
        // Configure the resources
        const endpoint = `projects/${keys.projectId}/locations/${keys.location}/endpoints/${keys.endpointId}`;

        const predictionInstance =
            new instance.TextClassificationPredictionInstance({
                content: text,
            });
        const instanceValue = predictionInstance.toValue();

        const instances = [instanceValue];
        const request = {
            endpoint,
            instances,
        };

        const [response] = await predictionServiceClient.predict(request);

        return response;
    }

    return {
        predictTextClassification: predictTextClassification,
    };
}

module.exports = AiPlatformController;