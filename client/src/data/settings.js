const personas = [
    'Rhey - Programming/Network Expert',
    'Rick - Rick and Morty',
    'Eva - World Renown Journalist',
    'Reef - World Class Surfer',
    'Ugg - The Caveman',
    'AI Assistant - Default ChatGPT',
    'Fiona - Novelist',
    'Jack - Comedian',
];

const settingsData = [
    {
        name: 'tokens',
        min: 50,
        max: 2050,
        step: 1,
        value: 2050,
        title: "Sets the token limit. While the max is around 4k tokens, it will reject the api call if it's set too high.",
    },
    {
        name: 'temperature',
        min: 0,
        max: 2,
        step: '.1',
        value: 0,
        title: 'What sampling temperature to use, between 0 and 2. Higher values like 0.8 will make the output more random, while lower values like 0.2 will make it more focused and deterministic. Best set to 0.',
    },
    {
        name: 'top_p',
        min: 0,
        max: 1,
        step: 0.1,
        value: 0.7,
        title: 'Adjust the top_p parameter to control the diversity of generated text. A higher value results in more diverse text, while a lower value results in more predictable text.',
    },
    {
        name: 'presencePenalty',
        min: -2,
        max: 2,
        step: 0.1,
        value: 0,
        title: "The presence_penalty setting is used in natural language processing to adjust the importance of presence in the context of a conversation. A high presence penalty means that the model will be less likely to generate a response that repeats or directly echoes the user's input. On the other hand, a low presence penalty means that the model will be more likely to generate a response that closely matches the user's input.",
    },
    {
        name: 'frequencyPenalty',
        min: -2,
        max: 2,
        step: 0.1,
        value: 0,
        title: 'This setting is also used in natural language processing and adjusts the importance of word frequency in the context of a conversation. A high frequency penalty means that the model will be less likely to generate a response that includes frequently used words. On the other hand, a low frequency penalty means that the model will be more likely to generate a response that includes frequently used words.',
    },
];

export { personas, settingsData };
