const { BedrockAgentRuntimeClient, RetrieveAndGenerateCommand  } = require("@aws-sdk/client-bedrock-agent-runtime");
const { BedrockClient, GetFoundationModelCommand } = require("@aws-sdk/client-bedrock")

const config = {
    region: "us-east-1"
};

const generateAnswer = async(key, query) => {
    try {
    let client = new BedrockClient(config);
    let input = { // GetFoundationModelRequest
        modelIdentifier: "amazon.titan-text-premier-v1:0", // required
      };
      let command = new GetFoundationModelCommand(input);
let response = await client.send(command);

const arn = response.modelDetails.modelArn;

    client = new BedrockAgentRuntimeClient(config);
    input = { // RetrieveRequest
        input: { // KnowledgeBaseQuery
          text: query, // required
        },
        retrieveAndGenerateConfiguration: { // KnowledgeBaseRetrievalConfiguration
            type: "KNOWLEDGE_BASE",

          knowledgeBaseConfiguration: { // KnowledgeBaseVectorSearchConfiguration
            knowledgeBaseId: "A3QZ6RQQMB",
            modelArn: arn,
            retrievalConfiguration: {
                vectorSearchConfiguration: {
                    numberOfResults: 1,
                    filter: {
                        equals: {
                            key: "key",
                            value: key
                        }
                    }
                }
            },
            generationConfiguration: {
                inferenceConfig: {
                    textInferenceConfig: {
                        temperature: 0.1,
                        topP: 0.9,
                        maxTokens: 1024,
                    }
                }
            }
          },
        }
      };

      command = new RetrieveAndGenerateCommand (input);
      response = await client.send(command);
      
      return response.output.text;
    }
    catch(err) {
        console.log(err.message);
        return "Sample answer";
    }
}

module.exports = generateAnswer;

