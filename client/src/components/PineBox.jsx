import axios from 'axios';
import { useEffect, useState, memo } from 'react';
import DisplaySemantic from './DisplaySemantic';

const MemoDisplaySemantic = memo(DisplaySemantic);

const PineBox = ({ injectVector }) => {
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

    useEffect(() => {
        injectVector(selectedItems);
    }, [selectedItems]);

    return (
        <div className='flex-box-col width-max overflow-scroll '>
            <div className='flex-box center '>
                <h1>Semantic Search & Injection</h1>
            </div>
            <form className='flex-box center' onSubmit={onSubmit}>
                <input
                    placeholder='Search'
                    className='semantic-search'
                    value={query}
                    onChange={(event) => setQuery(event.target.value)}
                />
            </form>
            <div>
                {pineQuery.map((item, index) => (
                    <div
                        className={`query-text center ${selectedItems.includes(item) ? 'selected' : ''}`}
                        key={index}
                        onClick={() => handleClick(item)}
                    >
                        <MemoDisplaySemantic item={item} />
                    </div>
                ))}
            </div>
        </div>
    );
};

export default PineBox;
