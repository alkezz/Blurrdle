import React, { useEffect, useState, useRef } from 'react';
import data from "../BookData/bookData.json"
import "./AutoCompleteSearchBox.css"

const AutocompleteSearchBox = ({ setInputValue, inputValue, setIsSelected, isSelected }) => {
    const [filteredOptions, setFilteredOptions] = useState([]);
    const componentRef = useRef(null);
    const filterOptions = (input) => {
        const filtered = data.Books.filter(option =>
            option.title.toLowerCase().includes(input.toLowerCase())
        );
        setFilteredOptions(filtered);
    };
    const handleKeyDown = (e) => {
        if (e.keyCode === 8) {
            // Backspace key was pressed
            setIsSelected(false)
        }
    };
    const handleClick = (title) => {
        setInputValue(title)
        setFilteredOptions([])
        setIsSelected(true)
    }
    useEffect(() => {
        if (inputValue.length) {
            filterOptions(inputValue);
        } else {
            setFilteredOptions([])
        }
    }, [inputValue, setInputValue, isSelected, setFilteredOptions])
    useEffect(() => {
        const handleOutsideClick = (event) => {
            if (componentRef.current && !componentRef.current.contains(event.target)) {
                // Click occurred outside the component
                // Perform the action to close the component here
                setFilteredOptions([])
            }
        };

        document.addEventListener('mousedown', handleOutsideClick);

        return () => {
            document.removeEventListener('mousedown', handleOutsideClick);
        };
    }, []);
    return (
        <div ref={componentRef} style={{ width: "650px" }}>
            <input
                type="text"
                value={inputValue}
                placeholder='Guess a book'
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyDown}
            />
            {filteredOptions.length > 4 && !isSelected && (
                <div className='filter-options-scroll'>
                    {filteredOptions.map(option => (
                        <span className='book-title-span' key={option.title} onClick={(e) => handleClick(option.title)}>
                            {option.title}
                        </span>
                    ))}
                </div>
            )}
            {filteredOptions.length <= 4 && filteredOptions.length >= 1 && !isSelected && (
                <div className='filter-options-noscroll'>
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
