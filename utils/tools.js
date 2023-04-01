import axios from 'axios';
import Messages from './../models/messages.js';

const getEmbeddings = async (content) => {
    const options = {
        headers: { Authorization: `Bearer ${process.env.OPEN_AI_KEY}`, 'Content-Type': 'application/json' },
    };
    const promptData = {
        input: content,
        model: 'text-embedding-ada-002',
    };

    try {
        const response = await axios.post('https://api.openai.com/v1/embeddings', promptData, options);
        const vector = response.data.data[0].embedding;
        return vector;
    } catch (error) {
        console.log(error.data);
    }
};

const callGPT = async (prompt, temperature, top_p, maxTokens, presencePenalty, frequencyPenalty, persona) => {
    const options = {
        headers: { Authorization: `Bearer ${process.env.OPEN_AI_KEY}`, 'Content-Type': 'application/json' },
    };
    const promptData = {
        model: 'gpt-3.5-turbo',
        messages: [
            { role: 'system', content: persona },
            { role: 'user', content: prompt },
        ],
        n: 1,
        top_p: top_p,
        temperature: temperature,
        max_tokens: maxTokens,
        presence_penalty: presencePenalty,
        frequency_penalty: frequencyPenalty,
    };

    try {
        const response = await axios.post('https://api.openai.com/v1/chat/completions', promptData, options);
        const data = response.data.choices[0].message.content;
        const usage = response.data.usage.total_tokens;
        const returnedData = { data, usage };

        return returnedData;
    } catch (error) {
        console.log(error.response.data.error);
    }
};

const getMessages = async (pineconeResults, score) => {
    let ids = [];
    let messages = [];

    try {
        ids = pineconeResults.matches.filter((match) => match.score >= score).map((match) => match.id);
        const mongoQuery = await Messages.find({ _id: { $in: ids } });
        messages = mongoQuery.map((item) => item.message);
    } catch (error) {
        console.log(error);
    }

    return messages;
};

export { getEmbeddings, callGPT, getMessages };
