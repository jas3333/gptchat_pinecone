import Messages from './../models/messages.js';
import personas from './../data/personas.js';
import { getEmbeddings, callGPT } from './../utils/tools.js';
import { queryIndex, upsert } from './../utils/pinecone.js';
import { v4 as uuidv4 } from 'uuid';

const sendQuestion = async (req, res) => {
    const conversation = req.body.conversation.length >= 2 ? req.body.conversation.slice(-2) : req.body.conversation;
    const conversationInjection = conversation.map((item) => `${item.promptQuestion}\n${item.botResponse}`);

    let vector = await getEmbeddings(req.body.promptQuestion);

    let uniqueID = uuidv4();

    let metaData = {
        _id: uniqueID,
        speaker: 'USER',
        message: req.body.promptQuestion,
    };

    console.log(metaData);

    // Dump meta data into MongoDB
    let createMessage = await Messages.create(metaData);

    const payload = [{ uniqueID, vector }];

    // Query Pinecone for matching info
    const pineconeResults = await queryIndex(vector);
    console.log(pineconeResults);

    const ids = pineconeResults.matches.filter((match) => match.score >= 0.85).map((match) => match.id);

    const mongoQuery = await Messages.find({ _id: { $in: ids } });
    const messages = mongoQuery.map((item) => item.message);

    // Inject the mongoQuery into the prompt
    const prompt = `Context: ${messages}\n${conversationInjection} User: ${req.body.promptQuestion}`;
    console.log(prompt);

    const { data, usage } = await callGPT(
        prompt,
        Number(req.body.temperature),
        Number(req.body.top_p),
        Number(req.body.tokens),
        Number(req.body.presencePenalty),
        Number(req.body.frequencyPenalty),
        personas[req.body.persona].prompt
    );

    // Get vectors from Ada-002
    vector = await getEmbeddings(data);
    uniqueID = uuidv4();

    metaData = {
        _id: uniqueID,
        speaker: personas[req.body.persona].name,
        message: data,
    };
    // Dump meta data into MongoDB
    createMessage = await Messages.create(metaData);

    payload.push({ uniqueID, vector });

    // Send the vectors to Pinecone DB
    const uploadVector = await upsert(payload);

    res.status(200).json({ message: data, profilePic: personas[req.body.persona].profilePic, usage: usage });
};

export { sendQuestion };
