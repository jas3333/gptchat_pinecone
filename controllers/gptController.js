import Messages from './../models/messages.js';
import personas from './../data/personas.js';
import { getEmbeddings, callGPT, getMessages } from './../utils/tools.js';
import { queryIndex, upsert } from './../utils/pinecone.js';
import { v4 as uuidv4 } from 'uuid';

const sendQuestion = async (req, res) => {
    // Sets conversation length
    const conversation = req.body.conversation.length >= 3 ? req.body.conversation.slice(-3) : req.body.conversation;
    const conversationInjection = conversation.map((item) => `${item.promptQuestion}\n${item.botResponse}`);
    const messageInjection = req.body.messagesToInject;

    console.log(messageInjection);

    let vector = await getEmbeddings(req.body.promptQuestion);
    let uniqueID = uuidv4();

    // let metaData = {
    //     _id: uniqueID,
    //     speaker: 'USER',
    //     message: req.body.promptQuestion,
    // };

    // Dump meta data into MongoDB
    // let createMessage = await Messages.create(metaData);

    // const payload = [{ uniqueID, vector }];

    // Query Pinecone for matching info
    const pineconeResults = await queryIndex(vector, 3);

    const messages = await getMessages(pineconeResults, 0.9);
    messages.push(messageInjection);

    // Inject the mongoQuery into the prompt
    const prompt = `Context: ${messages}\n${conversationInjection} User: ${req.body.promptQuestion}`;

    const { data, usage } = await callGPT(
        prompt,
        Number(req.body.temperature),
        Number(req.body.top_p),
        Number(req.body.tokens),
        Number(req.body.presencePenalty),
        Number(req.body.frequencyPenalty),
        personas[req.body.persona].prompt
    );

    const mongoData = `${req.body.promptQuestion}\n${data}`;

    // Get vectors from Ada-002
    vector = await getEmbeddings(mongoData);
    // uniqueID = uuidv4();

    const metaData = {
        _id: uniqueID,
        speaker: personas[req.body.persona].name,
        message: mongoData,
    };
    // // Dump meta data into MongoDB

    const payload = { uniqueID, vector };

    // // Send the vectors to Pinecone DB
    const uploadVector = await upsert(payload);
    const createMessage = await Messages.create(metaData);

    res.status(200).json({ message: data, profilePic: personas[req.body.persona].profilePic, usage: usage });
};

const summarize = async (req, res) => {
    const conversationData = req.body.conversation;
    const summaryData = conversationData.map((item) => `${item.promptQuestion}\n${item.botResponse}`);
    const prompt = `Conversation: ${summaryData}`;
    const persona = 'Please provide a detailed summary in a list format of the following conversation.';

    const data = await callGPT(
        prompt,
        Number(req.body.temperature),
        Number(req.body.top_p),
        Number(req.body.tokens),
        Number(req.body.presencePenalty),
        Number(req.body.frequencyPenalty),
        persona
    );

    console.log(data.data);

    try {
        const vector = await getEmbeddings(data.data);
        const uniqueID = uuidv4();
        console.log(vector);
        const payload = { uniqueID, vector };
        console.log(payload);

        const metaData = {
            _id: uniqueID,
            message: data.data,
        };

        const createMessage = await Messages.create(metaData);
        console.log(`Added summary to MongoDB`);
        const uploadVector = await upsert(payload);
        console.log(`Added payload to Pinecone`);

        res.status(200).json({ message: data });
    } catch (error) {
        console.log(error);
        res.status(400).json({ message: error });
    }
};

export { sendQuestion, summarize };
