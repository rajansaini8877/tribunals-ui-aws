const { BedrockAgentRuntimeClient, RetrieveAndGenerateCommand  } = require("@aws-sdk/client-bedrock-agent-runtime");
const { BedrockClient, GetFoundationModelCommand } = require("@aws-sdk/client-bedrock")
const {saveToCache, fetchFromCache} = require('../utils/manage-cache');

const config = {
    region: "us-east-1"
};

const generateAnswer = async(keys, query) => {
    try {
    let client = new BedrockClient(config);
    let input = { // GetFoundationModelRequest
        modelIdentifier: "amazon.titan-text-premier-v1:0", // required
      };
      let command = new GetFoundationModelCommand(input);
let response = await client.send(command);

const arn = response.modelDetails.modelArn;

    client = new BedrockAgentRuntimeClient(config);
    const filters = []
    for(const key of keys) {
        filters.push({
            equals: {
                key: "key",
                value: key
            }
        });
    }
    console.log(filters);
    filters.slice(0, 5);
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
                    numberOfResults: 50,
                    // filter: {
                    //     orAll: filters
                    // }
                    // filter: {
                    //     equals: {
                    //         key: "key",
                    //         value: key
                    //     }
                    // }
                }
            },
            generationConfiguration: {
                inferenceConfig: {
                    textInferenceConfig: {
                        temperature: 0,
                        topP: 0.9,
                        maxTokens: 1024,
                    }
                }
            }
          },
        }
      };

      if(keys.length > 1) {
        input.retrieveAndGenerateConfiguration.knowledgeBaseConfiguration.retrievalConfiguration.vectorSearchConfiguration['filter'] = {
            orAll: filters
        };
      }
      else if(keys.length == 1) {
        input.retrieveAndGenerateConfiguration.knowledgeBaseConfiguration.retrievalConfiguration.vectorSearchConfiguration['filter'] = filters[0];
      }

      command = new RetrieveAndGenerateCommand (input);
      response = await client.send(command);
      
      return response.output.text;
    }
    catch(err) {
        console.log(err.message);
        return "Sample answer";
    }
}

const generateSummary = async(key) => {
    const cacheKey = "Summary_"+key;
    const dataFromCache = await fetchFromCache(cacheKey);
    if(dataFromCache) {
        return dataFromCache;
    }
    
    const keys = [];
    keys.push(key);
    const answer = await generateAnswer(keys, "Generate detailed summary of the claim");
    
    await saveToCache(cacheKey, answer);
    return answer;
}

const generateDecision = async(key) => {
    const cacheKey = "Decision_"+key;
    
    const dataFromCache = await fetchFromCache(cacheKey);
    if(dataFromCache) {
        return dataFromCache;
    }

    const keys = [];
    keys.push(key);
    const answer = await generateAnswer(keys, "Is the claimant appeal allowed or dismissed?");
    await saveToCache(cacheKey, answer);
    return answer;
}

const generateInsights = async(keys) => {
    console.log("Inside generate insights: ");
    console.log(keys);
    const answer = await generateAnswer(keys, "Give me the list of evidences considered and short reasoning behind the tribunal decision in all the cases");
    console.log("Generated insights: "+answer);
    return answer;
}

module.exports = { 
    generateAnswer,
    generateSummary,
    generateDecision,
    generateInsights
};

