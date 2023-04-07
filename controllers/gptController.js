import Messages from './../models/messages.js';
import personas from './../data/personas.js';
import { getEmbeddings, callGPT, getMessages } from './../utils/tools.js';
import { queryIndex, upsert } from './../utils/pinecone.js';
import { v4 as uuidv4 } from 'uuid';

const sendQuestion = async (req, res) => {
    const processLog = [];

    // Sets conversation length
    const contextSize = req.body.contextSize;
    const conversation =
        req.body.conversation.length >= contextSize ? req.body.conversation.slice(-contextSize) : req.body.conversation;
    const conversationInjection = conversation.map((item) => `${item.promptQuestion}\n${item.botResponse}`);
    const messageInjection = req.body.messagesToInject.map((item) => item.message);
    let selectedPersona = req.body.persona;
    const customPersona = req.body.customPersona;

    processLog.push(`Custom persona: ${customPersona}`);
    processLog.push(`Vector Score: ${req.body.vectorScore}`);

    if (customPersona) {
        selectedPersona = personas.length;
        const newPersona = { name: 'Custom', prompt: customPersona, profilePic: 'custom.png' };
        personas.push(newPersona);
    }

    processLog.push(`Semantic search injection: ${messageInjection}`);

    let vector = await getEmbeddings(req.body.promptQuestion);
    let uniqueID = uuidv4();

    // Query Pinecone for matching info
    const pineconeResults = await queryIndex(vector, 3);

    processLog.push(`Pinecone results: ${JSON.stringify(pineconeResults)}\n`);

    const getMessageData = await getMessages(pineconeResults, req.body.vectorScore);
    const messages = getMessageData.map((item) => item.message);

    processLog.push(`Message Injection: ${messages}\n`);

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
        personas[selectedPersona].prompt
    );

    const mongoData = `${req.body.promptQuestion}\n${data}`;

    // Get vectors from Ada-002
    vector = await getEmbeddings(mongoData);

    const metaData = {
        _id: uniqueID,
        speaker: personas[selectedPersona].name,
        message: mongoData,
    };

    const payload = { uniqueID, vector };

    // // Send the vectors to Pinecone DB
    const uploadVector = await upsert(payload);
    const createMessage = await Messages.create(metaData);

    console.log(processLog.join('\n'));

    res.status(200).json({ message: data, profilePic: personas[selectedPersona].profilePic, usage: usage });
};

const summarize = async (req, res) => {
    const processLog = [];
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

    processLog.push(`GPT summarize response: ${data.data}\n`);

    try {
        const vector = await getEmbeddings(data.data);
        const uniqueID = uuidv4();
        processLog.push(`ADA Vectors: ${vector}\n`);
        const payload = { uniqueID, vector };
        processLog.push(`Vector Payload: ${JSON.stringify(payload)}\n`);

        const metaData = {
            _id: uniqueID,
            message: data.data,
        };

        const createMessage = await Messages.create(metaData);
        const uploadVector = await upsert(payload);

        console.log(processLog.join('\n'));

        res.status(200).json({ message: data });
    } catch (error) {
        console.log(error);
        res.status(400).json({ message: error });
    }
};

export { sendQuestion, summarize };
