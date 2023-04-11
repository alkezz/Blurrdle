import React, { useEffect, useState } from 'react';
import data from "../BookData/bookData.json"
import "./AutoCompleteSearchBox.css"

const AutocompleteSearchBox = ({ setInputValue, inputValue, setIsSelected, isSelected }) => {
    const [filteredOptions, setFilteredOptions] = useState([]);
    const filterOptions = (input) => {
        const filtered = data.Books.filter(option =>
            option.title.toLowerCase().includes(input.toLowerCase())
        );
        setFilteredOptions(filtered);
    };
    const handleClick = (title) => {
        setInputValue(title)
        setFilteredOptions([])
        setIsSelected(true)
    }
    useEffect(() => {
        if (inputValue.length >= 2 && !isSelected) {
            filterOptions(inputValue);
        } else {
            setFilteredOptions([])
        }
    }, [inputValue, setInputValue, isSelected, setFilteredOptions])
    return (
        <div style={{ width: "45%" }}>
            <input
                type="text"
                value={inputValue}
                placeholder='Guess a book'
                onChange={(e) => setInputValue(e.target.value)}
            />
            {filteredOptions.length > 0 && (
                <div className='filter-options'>
                    {filteredOptions.map(option => (
                        <span className='book-title-span' key={option.title} onClick={(e) => handleClick(option.title)}>
                            {option.title}
                        </span>
                    ))}
                </div>
            )}
        </div>
    );
};

export default AutocompleteSearchBox
