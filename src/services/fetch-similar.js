const { BedrockAgentRuntimeClient, RetrieveCommand } = require("@aws-sdk/client-bedrock-agent-runtime");

const config = {
    region: "us-east-1"
};

const fetchSimilar = async(query) => {
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
            results.push(item.content.text)
        }
      }

      return results;
    }
    catch(err) {
        console.log(err.message);
        return [];
    }
}

module.exports = fetchSimilar;


