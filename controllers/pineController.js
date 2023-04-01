import { queryIndex } from './../utils/pinecone.js';
import { getEmbeddings } from '../utils/tools.js';
import { getMessages } from './../utils/tools.js';

const queryPinecone = async (req, res) => {
    const processLog = [];
    const query = req.body.query;

    processLog.push(`Query: ${query}\n`);

    const vectors = await getEmbeddings(query);
    const pineconeResults = await queryIndex(vectors, 50);
    const messages = await getMessages(pineconeResults, 0.7);

    processLog.push(`Returned Messages: ${[messages]}`);

    console.log(processLog.join('\n'));
    res.status(200).json({ message: messages });
};

export { queryPinecone };
