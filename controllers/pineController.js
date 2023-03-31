import Messages from './../models/messages.js';
import { queryIndex } from './../utils/pinecone.js';
import { getEmbeddings } from '../utils/tools.js';
import { getMessages } from './../utils/tools.js';

const queryPinecone = async (req, res) => {
    const query = req.body.query;

    const vectors = await getEmbeddings(query);
    const pineconeResults = await queryIndex(vectors);
    const messages = await getMessages(pineconeResults);
    console.log(messages);

    res.status(200).json({ message: messages });
};

export { queryPinecone };
