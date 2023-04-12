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

        const newQuery = { query };
        try {
            const response = await axios.post('/api/v1/pine', newQuery);
            const data = response.data.message;

            setPineQuery(data);
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
    }, [selectedItems]);

    return (
        <div className='flex-box-col width-max overflow-scroll '>
            <div className='flex-box center'>
                <h1>Semantic Search & Injection</h1>
            </div>
            <form className='flex-box center align' onSubmit={onSubmit}>
                <input
                    placeholder='Search'
                    className='semantic-search'
                    value={query}
                    onChange={(event) => setQuery(event.target.value)}
                />
                <MdLayersClear
                    className='icon'
                    title='Clears selected search items.'
                    onClick={() => setSelectedItems([])}
                />
                <MdOutlineClearAll className='icon' title='Clears the search' onClick={clearSearch} />
                <GiNotebook
                    className='icon'
                    title='Add text via textarea and upload to DB'
                    onClick={() => setShowPineBox(false)}
                />
            </form>
            <div className='underline'></div>

            <div>
                {pineQuery.map((item, index) => (
                    <div className={`query-text center ${selectedItems.includes(item) ? 'selected' : ''} `} key={index}>
                        <div className='delete'>
                            <TiDelete
                                className='cursor'
                                onClick={() => deleteItem(item)}
                                title='This will remove the item from both databases.'
                            />
                        </div>
                        <div onClick={() => handleClick(item)} className='cursor'>
                            <MemoDisplaySemantic item={item.message} />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default PineBox;
