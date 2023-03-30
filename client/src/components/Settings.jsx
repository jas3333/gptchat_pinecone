import { memo } from 'react';
const Settings = memo(({ botSettings, settingsChange, reset }) => {
    return (
        <div className='settings-modal'>
            <form className=''>
                <div className='settings'>
                    <label htmlFor='options'>Persona: </label>

                    <select id='options' onChange={settingsChange} name='persona' value={botSettings.persona}>
                        <option value='0'>Rhey - Programming/Network Expert</option>
                        <option value='1'>Rick - Rick and Morty</option>
                        <option value='2'>Eva - World Renown Journalist</option>
                        <option value='3'>Reef - World Class Surfer</option>
                        <option value='4'>Ugg - The Caveman</option>
                        <option value='5'>AI Assistant - Default ChatGPT</option>
                        <option value='6'>Fiona - Novelist</option>
                        <option value='7'>Jack - Comedian</option>
                    </select>
                    <label className='value-label' htmlFor='tokens'>
                        Tokens: {botSettings.tokens}
                    </label>

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
                    <label className='value-label' htmlFor='tokens'>
                        Temperature: {botSettings.temperature}
                    </label>

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
                    <label className='value-label' htmlFor='tokens'>
                        Top_P: {botSettings.top_p}
                    </label>
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
                </div>
                <div className='settings'>
                    <label className='value-label' htmlFor='tokens'>
                        Presence Penalty: {botSettings.presencePenalty}
                    </label>

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
                    <label className='value-label' htmlFor='tokens'>
                        Frequency Penalty: {botSettings.frequencyPenalty}
                    </label>

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
                </div>
            </form>
            <div className='settings'>
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
