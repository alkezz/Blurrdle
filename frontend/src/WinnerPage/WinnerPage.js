import React, { useState, useEffect } from "react"
import StatsModal from "../StatsModal/StatsModal.js";
import Confetti from "react-confetti";
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import Paper from "@mui/material/Paper"

const WinnerPage = ({ oneBook, nextTriggerTime, setHasWon, setIsCorrect, setShowStats, showStats }) => {
    const titleLink = oneBook.title.split(" ").join("_")
    const [windowDimension, setWindowDimension] = useState({
        width: window.innerWidth,
        height: window.innerHeight,
    });
    const detectSize = () => {
        setWindowDimension({
            width: window.innerWidth,
            height: window.innerHeight,
        });
    };
    useEffect(() => {
        window.addEventListener("resize", detectSize);
        return () => {
            window.removeEventListener("resize", detectSize);
        };
    }, [windowDimension]);
    return (
        <>
            <StatsModal setShowStats={setShowStats} showStats={showStats} />
            <div className="guess-container">
                <Confetti
                    width={windowDimension.width}
                    height={windowDimension.height}
                />
                <div>
                    <h2 style={{ cursor: "default" }}>You got it!</h2>
                    <h2 style={{ cursor: "default" }}>
                        The correct answer was{" "}
                        <span style={{ color: "green", cursor: "default" }}>{oneBook?.title}</span> by{" "}
                        {oneBook?.author}!
                    </h2>
                </div>
                <div style={{ display: "flex" }}>
                    <div
                        style={{
                            display: "flex",
                            flexDirection: "column",
                            width: "100%",
                        }}
                    >
                        <div className="left-hint-top">
                            <Paper sx={{ backgroundColor: "#32354F", color: "white", height: "100%", display: "flex", justifyContent: "center", alignItems: "center", paddingLeft: "10px", paddingRight: "10px" }} elevation={8}>
                                {oneBook?.hint_1}
                            </Paper>
                        </div>
                        <div className="left-hint-bottom">
                            <Paper sx={{ backgroundColor: "#32354F", color: "white", height: "100%", display: "flex", justifyContent: "center", alignItems: "center", paddingLeft: "10px", paddingRight: "10px" }} elevation={8}>
                                {oneBook?.hint_3}
                            </Paper>
                        </div>
                    </div>
                    <div>
                        <img
                            alt="book cover"
                            className="no-blur"
                            src={oneBook?.book_cover}
                            draggable="false"
                        />
                    </div>
                    <div
                        style={{
                            display: "flex",
                            flexDirection: "column",
                            width: "100%",
                        }}
                    >
                        <div className="right-hint-top">
                            <Paper sx={{ backgroundColor: "#32354F", color: "white", height: "100%", display: "flex", justifyContent: "center", alignItems: "center", paddingLeft: "10px", paddingRight: "10px" }} elevation={8}>
                                {oneBook?.hint_2.split("")[oneBook?.hint_2.split("").length - 1] === "." ? `${oneBook?.hint_2} It was released in ${oneBook?.release_year}.` : `${oneBook?.hint_2}. It was released in ${oneBook?.release_year}.`}
                            </Paper>
                        </div>
                        <div className="right-hint-bottom">
                            <Paper sx={{ backgroundColor: "#32354F", color: "white", height: "100%", display: "flex", justifyContent: "center", alignItems: "center" }} elevation={8}>
                                It was written by {oneBook?.author}.
                            </Paper>
                        </div>
                    </div>
                </div>
                <a rel="noreferrer" target='_blank' href={`https://en.wikipedia.org/wiki/${titleLink}`}>
                    <h3 style={{ width: "850px", cursor: "pointer" }}>{oneBook?.description}<OpenInNewIcon style={{ marginBottom: "-3px", fontSize: "20px" }} /></h3>
                </a>
            </div>
        </>
    )
}

export default WinnerPage
