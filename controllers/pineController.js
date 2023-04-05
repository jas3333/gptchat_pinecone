import Messages from './../models/messages.js';
import axios from 'axios';
import { queryIndex } from './../utils/pinecone.js';
import { getEmbeddings } from '../utils/tools.js';
import { getMessages } from './../utils/tools.js';

const queryPinecone = async (req, res) => {
    const query = req.body.query;

    const vectors = await getEmbeddings(query);
    const pineconeResults = await queryIndex(vectors, 100);

    const messages = await getMessages(pineconeResults, 0.7);
    console.log(messages);

    res.status(200).json({ message: messages });
};

const deleteItem = async (req, res) => {
    const id = req.params.id;

    const options = {
        method: 'POST',
        url: `${process.env.PINECONE_URL}/vectors/delete`,
        headers: {
            accept: 'application/json',
            'content-type': 'application/json',
            'Api-Key': process.env.PINECONE_API,
        },
        data: {
            ids: id,
        },
    };

    try {
        const response = await axios.request(options);
        console.log(`${response.statusText}: Vector Id: ${id} removed.`);
    } catch (error) {
        console.log(error);
        res.status(400).json({ message: error });
    }

    try {
        await Messages.deleteOne({ _id: id });
        res.status(204).json({ message: `${id} removed.` });
    } catch (error) {
        console.log(error);
        res.status(400).json({ message: error });
    }
};

export { queryPinecone, deleteItem };
