import { useState } from 'react';
import style from './styles/UploadBox.module.css';
const UploadBox = ({ setShowPineBox }) => {
    const [text, setText] = useState('');
    const [showPreview, setShowPreview] = useState(false);
    return (
        <div className={style.mainContainer}>
            <div className={style.container}>
                <h1>Upload notes or Text</h1>
            </div>
            <div className={style.underline}></div>
            <div className={style.container}>
                <form className={style.form}>
                    <textarea
                        rows='10'
                        cols='80'
                        value={text}
                        onChange={(event) => setText(event.target.value)}
                        className={style.textArea}
                    ></textarea>
                </form>
                <div className={style.buttonBox}>
                    <button className={style.button} onClick={() => setShowPreview(!showPreview)}>{`${
                        showPreview ? 'Edit' : 'Preview'
                    }`}</button>
                    <button className={style.button} onClick={() => setText('')}>
                        Clear
                    </button>
                    <button className={style.button}>Upload</button>
                    <button className={style.button} onClick={() => setShowPineBox(true)}>
                        Back to Search
                    </button>
                </div>
            </div>
        </div>
    );
};

export default UploadBox;
