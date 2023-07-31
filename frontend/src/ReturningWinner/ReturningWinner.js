import React from 'react'
import CountdownTimer from "../CountdownTimer/CountdownTimer.tsx"
import StatsModal from '../StatsModal/StatsModal.js';
import Paper from "@mui/material/Paper"
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import "./ReturningWinner.css"

const ReturningWinner = ({ oneBook, nextTriggerTime, setHasWon, setIsCorrect, showStats, setShowStats }) => {
    const playerStats = localStorage.getItem("player_stats")
    const titleLink = oneBook.title.split(" ").join("_")
    return (
        <>
            <StatsModal showStats={showStats} setShowStats={setShowStats} />
            {<CountdownTimer nextTriggerTime={nextTriggerTime} setHasWon={setHasWon} setIsCorrect={setIsCorrect} />}
            <div className="guess-container">
                {(playerStats.guesses_today === 0 || playerStats.guesses_today > 1) && (
                    <h2 style={{ marginBottom: "-20px", cursor: "default" }}>You got it {playerStats.guesses_today === 0 ? <span style={{ color: "green" }}>first try!</span> : <span>in <span style={{ color: "green" }}>{playerStats.guesses_today}</span> guesses!</span>}</h2>
                )}
                {playerStats.guesses_today === 1 && (
                    <h2 style={{ marginBottom: "-20px", cursor: "default" }}>You got it in <span style={{ color: "green" }}>{playerStats.guesses_today}</span> guess!</h2>
                )}
                <h2 style={{ cursor: "default" }}>
                    The correct answer was{" "}
                    <span style={{ color: "green", cursor: "default" }}>{oneBook?.title}</span> by{" "}
                    {oneBook?.author}!
                    <br />
                </h2>
                <br />
                <div style={{ display: "flex" }}>
                    <div
                        style={{
                            display: "flex",
                            flexDirection: "column",
                            width: "100%"
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
                            width: "100%"
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
            </div >
        </>
    )
}
export default ReturningWinner
