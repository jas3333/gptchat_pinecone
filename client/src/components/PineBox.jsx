import style from './styles/Pinebox.module.css';
import axios from 'axios';
import { useEffect, useState, memo } from 'react';
import { MdLayersClear, MdOutlineClearAll } from 'react-icons/md';
import { TiDelete } from 'react-icons/ti';
import { GiNotebook } from 'react-icons/gi';
import DisplaySemantic from './DisplaySemantic';

const MemoDisplaySemantic = memo(DisplaySemantic);

const PineBox = ({ injectVector, setShowPineBox }) => {
    const [query, setQuery] = useState('');
    const [pineQuery, setPineQuery] = useState([]);
    const [selectedItems, setSelectedItems] = useState([]);

    const handleClick = (item) => {
        if (selectedItems.includes(item)) {
            setSelectedItems(selectedItems.filter((selectedItem) => selectedItem !== item));
        } else {
            setSelectedItems([...selectedItems, item]);
        }
    };

    const onSubmit = async (event) => {
        event.preventDefault();

        try {
            const response = await axios.post('http://localhost:4005/api/v1/pine', { query });
            setPineQuery(response.data.message);
        } catch (error) {
            console.log(error);
        }
    };

    const deleteItem = async (item) => {
        console.log(item);
        const id = item._id;
        setPineQuery(pineQuery.filter((item) => item._id !== id));

        try {
            const response = await axios.delete(`/api/v1/pine/${id}`);

            console.log(response);
        } catch (error) {
            console.log(error);
        }
    };

    const clearSearch = () => {
        setQuery('');
        setPineQuery([]);
    };

    useEffect(() => {
        injectVector(selectedItems);
    }, [selectedItems, injectVector]);

    return (
        <div className={style.pineContainer}>
            <div className={style.headerText}>
                <h1>Semantic Search & Injection</h1>
            </div>
            <form className={style.formContainer} onSubmit={onSubmit}>
                <input
                    placeholder='Search'
                    className={style.semanticSearch}
                    value={query}
                    onChange={(event) => setQuery(event.target.value)}
                />
                <MdLayersClear
                    className={style.icon}
                    title='Clears selected search items.'
                    onClick={() => setSelectedItems([])}
                />
                <MdOutlineClearAll className={style.icon} title='Clears the search' onClick={clearSearch} />
                <GiNotebook
                    className={style.icon}
                    title='Add text via textarea and upload to DB'
                    onClick={() => setShowPineBox(false)}
                />
            </form>
            <div className='underline'></div>

            <div>
                {pineQuery.map((item, index) => (
                    <div
                        className={`${style.queryText} ${selectedItems.includes(item) ? style.selected : ''} `}
                        key={index}
                    >
                        <div className={style.delete}>
                            <TiDelete
                                className={style.cursor}
                                onClick={() => deleteItem(item)}
                                title='This will remove the item from both databases.'
                            />
                        </div>
                        <div onClick={() => handleClick(item)} className={style.cursor}>
                            <MemoDisplaySemantic item={item.message} />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default PineBox;
