import { memo } from 'react';
import { personas } from './../data/settings';

const Settings = memo(({ botSettings, settingsChange, reset }) => {
    return (
        <div className='settings-container'>
            <form className=''>
                <div className='settings'>
                    <label htmlFor='options'>Persona: </label>

                    <select id='options' onChange={settingsChange} name='persona' value={botSettings.persona}>
                        {personas.map((name, index) => (
                            <option value={`${index}`} key={index}>
                                {name}
                            </option>
                        ))}
                    </select>
                    <label className='value-label'>Custom:</label>
                    <textarea
                        rows='5'
                        cols='10'
                        placeholder='Create a custom persona, any text here will be used instead of the selected persona.'
                        id='customPersona'
                        name='customPersona'
                        value={botSettings.customPersona}
                        onChange={settingsChange}
                    />

                    <label className='value-label'>Tokens: {botSettings.tokens}</label>
                    <input
                        className='slider'
                        id='tokens'
                        type='range'
                        min='50'
                        max='2050'
                        step='1'
                        name='tokens'
                        value={botSettings.tokens}
                        onChange={settingsChange}
                        title="Sets the token limit. While the max is around 4k tokens, it will reject the api call if it's set too high."
                    />

                    <label className='value-label'>Temperature: {botSettings.temperature}</label>
                    <input
                        className='slider'
                        id='tokens'
                        type='range'
                        min='0'
                        max='2'
                        step='.1'
                        name='temperature'
                        value={botSettings.temperature}
                        onChange={settingsChange}
                        title='What sampling temperature to use, between 0 and 2. Higher values like 0.8 will make the output more random, while lower values like 0.2 will make it more focused and deterministic. Best set to 0.'
                    />

                    <label className='value-label'>Top_P: {botSettings.top_p}</label>
                    <input
                        className='slider'
                        id='tokens'
                        type='range'
                        min='.1'
                        max='1'
                        step='.1'
                        name='top_p'
                        value={botSettings.top_p}
                        onChange={settingsChange}
                        title='Adjust the top_p parameter to control the diversity of generated text. A higher value results in more diverse text, while a lower value results in more predictable text.'
                    />

                    <label className='value-label'>Presence Penalty: {botSettings.presencePenalty}</label>
                    <input
                        className='slider'
                        id='tokens'
                        type='range'
                        min='-2'
                        max='2'
                        step='.1'
                        name='presencePenalty'
                        value={botSettings.presencePenalty}
                        onChange={settingsChange}
                        title="The presence_penalty setting is used in natural language processing to adjust the importance of presence in the context of a conversation. A high presence penalty means that the model will be less likely to generate a response that repeats or directly echoes the user's input. On the other hand, a low presence penalty means that the model will be more likely to generate a response that closely matches the user's input."
                    />

                    <label className='value-label'>Frequency Penalty: {botSettings.frequencyPenalty}</label>
                    <input
                        className='slider'
                        id='tokens'
                        type='range'
                        min='-2'
                        max='2'
                        step='.1'
                        name='frequencyPenalty'
                        value={botSettings.frequencyPenalty}
                        onChange={settingsChange}
                        title='This setting is also used in natural language processing and adjusts the importance of word frequency in the context of a conversation. A high frequency penalty means that the model will be less likely to generate a response that includes frequently used words. On the other hand, a low frequency penalty means that the model will be more likely to generate a response that includes frequently used words.'
                    />

                    <label className='value-label'>Context Size: {botSettings.contextSize}</label>
                    <input
                        className='slider'
                        id='contextSize'
                        type='range'
                        min='1'
                        max='10'
                        step='1'
                        name='contextSize'
                        value={botSettings.contextSize}
                        onChange={settingsChange}
                        title='This will change the size of the bots memory. Setting this too high may exceed the token limit.'
                    />

                    <label className='value-label'>Vector Score: {botSettings.vectorScore}</label>
                    <input
                        className='slider'
                        id='vectorScore'
                        type='range'
                        min='0.1'
                        max='0.99'
                        step='.01'
                        name='vectorScore'
                        value={botSettings.vectorScore}
                        onChange={settingsChange}
                        title='This will adjust the vector score, a higher score will inject more relevant data into the prompt.'
                    />
                    <label className='value-label'>TopK: {botSettings.topK}</label>
                    <input
                        className='slider'
                        id='topK'
                        type='range'
                        min='0'
                        max='30'
                        step='1'
                        name='topK'
                        value={botSettings.topK}
                        onChange={settingsChange}
                        title='This will adjust how many vectors will be returned to be injected into the prompt. Setting too high will most likely exceed the token count if you have too many matches.'
                    />
                </div>
            </form>
            <div className='container-flex'>
                <button
                    onClick={reset}
                    className='btn'
                    title='Removes conversation saved in local storage and resets the conversation. The model still has access to conversations stored in the database.'
                >
                    Reset
                </button>
            </div>
        </div>
    );
});

export default Settings;
