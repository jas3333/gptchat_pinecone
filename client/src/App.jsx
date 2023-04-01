import { useEffect, useState, memo } from 'react';
import axios from 'axios';
import Chatbox from './components/Chatbox';
import Settings from './components/Settings';
import PineBox from './components/PineBox';

const MemoChatbox = memo(Chatbox);
const MemoPineBox = memo(PineBox);

function App() {
    const [promptQuestion, setPromptQuestion] = useState('');
    const [conversation, setConversation] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [showModal, setShowModal] = useState(true);
    const [summaryCounter, setSummaryCounter] = useState(0);
    const [injection, setInjection] = useState([]);

    const [botSettings, setBotSettings] = useState({
        persona: 0,
        customPersona: '',
        tokens: 2050,
        temperature: 0,
        presencePenalty: 0,
        frequencyPenalty: 0,
        top_p: 0.7,
    });

    const settingsChange = (event) => {
        setBotSettings((prevState) => ({
            ...prevState,
            [event.target.name]: event.target.value,
        }));
    };

    const injectVector = (messages) => {
        setInjection(messages);
    };

    const summary = async () => {
        const summaryData = {
            conversation: conversation.slice(-5),
            ...botSettings,
        };
        try {
            const response = await axios.post('/api/v1/gpt/summary', summaryData);
        } catch (error) {
            console.log(error);
        }
    };

    const handleSubmit = async (event, promptQuestion) => {
        event.preventDefault();

        try {
            setIsLoading(true);
            const response = await axios.post('/api/v1/gpt', {
                promptQuestion,
                ...botSettings,
                conversation: [...conversation],
                messagesToInject: injection,
            });
            const newChat = {
                promptQuestion,
                botResponse: response.data.message,
                profilePic: response.data.profilePic,
                usage: response.data.usage,
            };
            if (conversation.length > 100) {
                setConversation(conversation.shift());
            }
            setConversation([...conversation, newChat]);
            localStorage.setItem('conversation', JSON.stringify([...conversation, newChat]));
        } catch (error) {
            console.log(error);
        }

        setIsLoading(false);
        setPromptQuestion('');
        if (summaryCounter === 5) {
            summary();
            setSummaryCounter(0);
        } else {
            setSummaryCounter(summaryCounter + 1);
        }
    };

    const reset = async () => {
        setConversation([]);
        localStorage.removeItem('conversation');
    };

    useEffect(() => {
        const savedConversation = localStorage.getItem('conversation');
        if (savedConversation) {
            setConversation(JSON.parse(savedConversation));
        }
    }, []);

    const chatboxProps = {
        handleSubmit,
        promptQuestion,
        setPromptQuestion,
        conversation,
        isLoading,
        setShowModal,
        showModal,
    };

    const settings = {
        botSettings,
        setBotSettings,
        settingsChange,
        reset,
    };

    return (
        <div className='container'>
            <Settings {...settings} />
            <MemoChatbox {...chatboxProps} />
            <MemoPineBox injectVector={injectVector} />
        </div>
    );
}

export default App;
