import { useState } from 'react';
import style from './styles/UploadBox.module.css';
import axios from 'axios';
import DisplaySemantic from './DisplaySemantic';

const UploadBox = ({ setShowPineBox, setNotification, setShowNotification }) => {
    const [text, setText] = useState('');
    const [showPreview, setShowPreview] = useState(false);

    const onUpload = async () => {
        try {
            const response = axios.post('/api/v1/pine/upload', { text });
            console.log(response);
            setNotification({ message: 'Successfully uploaded note.', type: 'success' });
            setShowNotification(true);
            setText('');
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <div className={style.mainContainer}>
            <div className={style.container}>
                <h1>Upload notes or Text</h1>
            </div>
            <div className={style.buttonBox}>
                <button className={style.button} onClick={() => setShowPreview(!showPreview)}>{`${
                    showPreview ? 'Edit' : 'Preview'
                }`}</button>
                <button className={style.button} onClick={() => setText('')}>
                    Clear
                </button>
                <button className={style.button} onClick={onUpload}>
                    Upload
                </button>
                <button className={style.button} onClick={() => setShowPineBox(true)}>
                    Back to Search
                </button>
            </div>
            <div className={style.container}>
                {showPreview ? (
                    <div className={style.preview}>
                        <DisplaySemantic item={text} />
                    </div>
                ) : (
                    <textarea
                        rows='20'
                        cols='120'
                        value={text}
                        onChange={(event) => setText(event.target.value)}
                        className={style.textArea}
                    ></textarea>
                )}
            </div>
        </div>
    );
};

export default UploadBox;
