import { useEffect, useRef, memo } from 'react';
import DisplayChat from './../components/DisplayChat';
import InputBox from './InputBox';

const MemoDisplayChat = memo(DisplayChat);

const Chatbox = ({ promptQuestion, setPromptQuestion, handleSubmit, conversation, isLoading }) => {
    const containerRef = useRef(null);

    useEffect(() => {
        containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }, [conversation]);

    return (
        <div className='container-col'>
            <div className='chatbox' ref={containerRef}>
                {conversation.map((item, index) => {
                    return <MemoDisplayChat key={index} item={item} />;
                })}
            </div>
            <div className='user-input '>
                <InputBox
                    handleSubmit={handleSubmit}
                    promptQuestion={promptQuestion}
                    setPromptQuestion={setPromptQuestion}
                />
                <div>{isLoading && <div className='loading-indicator'></div>}</div>
            </div>
        </div>
    );
};

export default Chatbox;
