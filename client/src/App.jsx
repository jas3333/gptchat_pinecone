import style from './components/styles/App.module.css';
import { useEffect, useState, memo } from 'react';
import axios from 'axios';
import Chatbox from './components/Chatbox';
import Settings from './components/Settings';
import PineBox from './components/PineBox';
import UploadBox from './components/UploadBox';
import Notify from './components/Notify';

const MemoChatbox = memo(Chatbox);
const MemoPineBox = memo(PineBox);

function App() {
    const [promptQuestion, setPromptQuestion] = useState('');
    const [conversation, setConversation] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [showModal, setShowModal] = useState(true);
    const [summaryCounter, setSummaryCounter] = useState(0);
    const [injection, setInjection] = useState([]);
    const [showPineBox, setShowPineBox] = useState(true);
    const [showNotification, setShowNotification] = useState(false);
    const [notification, setNotification] = useState({ message: '', type: '' });

    const [botSettings, setBotSettings] = useState({
        persona: 0,
        customPersona: '',
        contextSize: 3,
        vectorScore: 0.85,
        tokens: 2050,
        temperature: 0,
        presencePenalty: 0,
        frequencyPenalty: 0,
        top_p: 0.7,
        topK: 3,
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
            console.log(response);
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
        setSummaryCounter(0);
        localStorage.removeItem('conversation');
        setNotification({ message: 'Conversation reset.', type: 'success' });
        setShowNotification(true);
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

    const uploadBoxProps = {
        setShowPineBox,
        setNotification,
        setShowNotification,
    };

    return (
        <div className={style.mainContainer}>
            <div className={style.containerCol}>
                <Settings {...settings} />
                {showNotification && <Notify notification={notification} setShowNotification={setShowNotification} />}
            </div>
            <MemoChatbox {...chatboxProps} />
            <div className={style.sideContainer}>
                {showPineBox ? (
                    <MemoPineBox injectVector={injectVector} setShowPineBox={setShowPineBox} />
                ) : (
                    <UploadBox {...uploadBoxProps} />
                )}
            </div>
        </div>
    );
}

export default App;
