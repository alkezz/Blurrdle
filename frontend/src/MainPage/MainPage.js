import React from "react"
import AutocompleteSearchBox from "../AutoComplete/AutoCompleteSearchBox";
import FavoriteIcon from "@mui/icons-material/Favorite";
import Paper from "@mui/material/Paper"

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
                Submit
            </button>
            <button className="submit-button" onClick={() => localStorage.clear()}>
                Clear LS
            </button>
            <br />
            <h2>Can you guess this book?</h2>
            <div style={{ display: "flex" }}>
                <div
                    style={{
                        display: "flex",
                        flexDirection: "column",
                        width: "350px"
                    }}
                >
                    {(showHint >= 1 || Number(localStorage.getItem("hint")) >= 1) && (
                        <div className="left-hint-top">
                            <Paper sx={{ backgroundColor: "#1f244a", color: "white", padding: "15px" }} variant="outlined" elevation={8}>
                                {oneBook?.hint_1}
                            </Paper>
                        </div>
                    )}
                    {(showHint >= 3 || Number(localStorage.getItem("hint")) >= 3) && (
                        <div className="left-hint-bottom">
                            <Paper sx={{ backgroundColor: "#1f244a", color: "white", padding: "15px" }} variant="outlined" elevation={3}>
                                {oneBook?.hint_3}
                            </Paper>
                        </div>
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
                    {(showHint >= 2 || Number(localStorage.getItem("hint")) >= 2) && (
                        <div className="right-hint-top">
                            <Paper sx={{ backgroundColor: "#1f244a", color: "white", padding: "15px" }} variant="outlined" elevation={3}>
                                {oneBook?.hint_2}. It was released in{" "}
                                {oneBook?.release_year}
                            </Paper>
                        </div>
                    )}
                    {(showHint >= 4 || Number(localStorage.getItem("hint")) >= 4) && (
                        <div className="right-hint-bottom">
                            <Paper sx={{ backgroundColor: "#1f244a", color: "white", padding: "15px" }} variant="outlined" elevation={3}>
                                It was written by {oneBook?.author}
                            </Paper>
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
