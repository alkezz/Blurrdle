import React from "react"
import 'react-circular-progressbar/dist/styles.css';
import Paper from "@mui/material/Paper"
import StatsModal from "../StatsModal/StatsModal.js";
import OpenInNewIcon from '@mui/icons-material/OpenInNew';

const LoserPage = ({ oneBook, showStats, setShowStats }) => {
    const titleLink = oneBook.title.split(" ").join("_")
    return (
        <>
            <StatsModal setShowStats={setShowStats} showStats={showStats} />
            <div className="guess-container">
                <h2 style={{ cursor: "default", marginBottom: "-10px" }}>Too bad! You didn't get the book right!</h2>
                <h2 style={{ cursor: "default" }}>
                    The correct answer was{" "}
                    <span style={{ color: "red", cursor: "default" }}>{oneBook?.title}</span> by{" "}
                    {oneBook?.author}
                </h2>
                <div style={{ display: "flex" }}>
                    <div
                        style={{
                            display: "flex",
                            flexDirection: "column",
                            width: "350px",
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
                            width: "350px",
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

export default LoserPage
