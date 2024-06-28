const { BedrockAgentRuntimeClient, RetrieveCommand } = require("@aws-sdk/client-bedrock-agent-runtime");

const config = {
    region: "us-east-1"
};

const fetchSimilarAct = async(query) => {
    try {
    const client = new BedrockAgentRuntimeClient(config);
    const input = { // RetrieveRequest
        knowledgeBaseId: "QGUMPYFD9T", // required
        retrievalQuery: { // KnowledgeBaseQuery
          text: query, // required
        },
        retrievalConfiguration: { // KnowledgeBaseRetrievalConfiguration
          vectorSearchConfiguration: { // KnowledgeBaseVectorSearchConfiguration
            numberOfResults: 5
          },
        }
      };

      const command = new RetrieveCommand(input);
      const response = await client.send(command);
      const results = [];
      if(response.retrievalResults) {
        for (const item of response.retrievalResults) {
            const result = {};
            result['value'] = item.content.text;
            let key = item.location.s3Location.uri.split('/');
            key = key[key.length-1];
            key = key.slice(0, -4); 
            result['key'] = key
            results.push(result);
        }
      }

      return results;
    }
    catch(err) {
        console.log(err.message);
        return [];
    }
}

const fetchSimilarAppeal = async(query) => {
    try {
    const client = new BedrockAgentRuntimeClient(config);
    const input = { // RetrieveRequest
        knowledgeBaseId: "A3QZ6RQQMB", // required
        retrievalQuery: { // KnowledgeBaseQuery
          text: query, // required
        },
        retrievalConfiguration: { // KnowledgeBaseRetrievalConfiguration
          vectorSearchConfiguration: { // KnowledgeBaseVectorSearchConfiguration
            numberOfResults: 5
          },
        }
      };
      const command = new RetrieveCommand(input);
      const response = await client.send(command);
      const results = [];
      const keys = [];
      if(response.retrievalResults) {
        for (const item of response.retrievalResults) {
            result = {};
            result['key'] = item.metadata.key;
            result['text'] = item.content.text;
            result['uri'] = item.location.s3Location.uri;
            if(keys.includes(result['key'])) {
              continue;
            }
            results.push(result);
            keys.push(result['key']);
        }
      }

      return results;
    }
    catch(err) {
        console.log(err.message);
        const errResults = [];
        const errResult = {
            key: "SampleKey",
            text: "Sample Text for Description",
            uri: "sampleURI"
        }
        errResults.push(errResult);
        return errResults;
    }
}

module.exports = {
    fetchSimilarAct,
    fetchSimilarAppeal
};


