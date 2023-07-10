import React, { useEffect } from "react"
import AutocompleteSearchBox from "../AutoComplete/AutoCompleteSearchBox";
import FavoriteIcon from "@mui/icons-material/Favorite";
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import Paper from "@mui/material/Paper"
import Button from '@mui/material/Button';

const MainPage = ({ isSelected, setIsSelected, inputValue, setInputValue, oneBook, showHint, screenShake, lives, handleSubmit, isError }) => {
    useEffect(() => {
        const errorSpan = document.getElementById("error-span")
        if (isError) {
            errorSpan.style.visibility = "visible"
        } else {
            errorSpan.style.visibility = "hidden"
        }
    }, [isError])
    return (
        <div className="guess-container">
            <span style={{ visibility: "hidden", color: "red" }} id='error-span'>Please Enter a valid book!</span>
            <AutocompleteSearchBox
                isSelected={isSelected}
                setIsSelected={setIsSelected}
                inputValue={inputValue}
                setInputValue={setInputValue}
            />
            <br />
            <Button sx={{
                ':hover': {
                    bgcolor: 'white', // theme.palette.primary.main
                    color: 'black'
                },
                backgroundColor: "white",
                color: "black",
                fontWeight: "550"
            }} onClick={handleSubmit} variant="contained" endIcon={<ArrowForwardIcon />}>
                Submit
            </Button>
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
                            <Paper sx={{ backgroundColor: "#32354F", color: "white", height: "100%", display: "flex", justifyContent: "center", alignItems: "center", paddingLeft: "10px", paddingRight: "10px" }} elevation={8}>
                                {oneBook?.hint_1}
                            </Paper>
                        </div>
                    )}
                    {(showHint >= 3 || Number(localStorage.getItem("hint")) >= 3) && (
                        <div className="left-hint-bottom">
                            <Paper sx={{ backgroundColor: "#32354F", color: "white", height: "100%", display: "flex", justifyContent: "center", alignItems: "center", paddingLeft: "10px", paddingRight: "10px" }} elevation={8}>
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
                        width: "350px"
                    }}
                >
                    {(showHint >= 2 || Number(localStorage.getItem("hint")) >= 2) && (
                        <div className="right-hint-top">
                            <Paper sx={{ backgroundColor: "#32354F", color: "white", height: "100%", display: "flex", justifyContent: "center", alignItems: "center", paddingLeft: "10px", paddingRight: "10px" }} elevation={8}>
                                {oneBook?.hint_2} It was released in{" "}
                                {oneBook?.release_year}
                            </Paper>
                        </div>
                    )}
                    {(showHint >= 4 || Number(localStorage.getItem("hint")) >= 4) && (
                        <div className="right-hint-bottom">
                            <Paper sx={{ backgroundColor: "#32354F", color: "white", height: "100%", display: "flex", justifyContent: "center", alignItems: "center" }} elevation={8}>
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
            </div>
        </div>
    )
}

export default MainPage
