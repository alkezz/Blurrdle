import React, { useState, useEffect } from "react"
import AutocompleteSearchBox from "../AutoComplete/AutoCompleteSearchBox";
import FavoriteIcon from "@mui/icons-material/Favorite";

const MainPage = ({ isSelected, setIsSelected, inputValue, setInputValue, oneBook, showHint, screenShake, lives, handleSubmit }) => {

    return (
        <div className="guess-container">
            <AutocompleteSearchBox
                isSelected={isSelected}
                setIsSelected={setIsSelected}
                inputValue={inputValue}
                setInputValue={setInputValue}
            />
            <br />
            <button className="submit-button" onClick={handleSubmit}>
                SUBMIT
            </button>
            <br />
            <h2>Can you guess this book?</h2>
            <div style={{ display: "flex" }}>
                <div
                    style={{
                        display: "flex",
                        flexDirection: "column",
                        width: "350px",
                    }}
                >
                    {showHint >= 1 && (
                        <div className="left-hint">{oneBook?.hint_1}</div>
                    )}
                    {showHint >= 3 && (
                        <div className="left-hint">{oneBook?.hint_3}</div>
                    )}
                </div>
                &nbsp;
                &nbsp;
                &nbsp;
                <div>
                    <img
                        alt="book cover"
                        className="no-blur"
                        src={oneBook?.blurred_cover}
                    />
                </div>
                &nbsp;
                &nbsp;
                &nbsp;
                <div
                    style={{
                        display: "flex",
                        flexDirection: "column",
                        width: "350px",
                    }}
                >
                    {showHint >= 2 && (
                        <div className="right-hint">
                            {oneBook?.hint_2}. It was released in{" "}
                            {oneBook?.release_year}
                        </div>
                    )}
                    {showHint >= 4 && (
                        <div className="right-hint">
                            It was written by {oneBook?.author}
                        </div>
                    )}
                </div>
            </div>
            <div style={{ marginTop: "15px" }}>
                {[...Array(lives)].map((_, i) => (
                    <FavoriteIcon sx={{ color: "red", fontSize: "30px" }} />
                ))}
                {screenShake && <span className="falling-number">-1</span>}
            </div>
        </div>
    )
}

export default MainPage
