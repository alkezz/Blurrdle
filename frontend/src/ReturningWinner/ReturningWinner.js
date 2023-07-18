import React from 'react'
import CountdownTimer from "../CountdownTimer/CountdownTimer.tsx"
import Paper from "@mui/material/Paper"

const ReturningWinner = ({ oneBook, nextTriggerTime, setHasWon, setIsCorrect }) => {
    const playerStats = JSON.parse(localStorage.getItem("player_stats"));
    return (
        <div className="guess-container">
            <h2 style={{ marginBottom: "-20px", cursor: "default" }}>You got it {playerStats.guesses_today === 0 ? <span style={{ color: "green" }}>first try you book worm</span> : <span>in <span style={{ color: "green" }}>{playerStats.guesses_today}</span> guesses</span>}!</h2>
            <h2 style={{ cursor: "default" }}>
                The correct answer was{" "}
                <span style={{ color: "green", cursor: "default" }}>{oneBook?.title}</span> by{" "}
                {oneBook?.author}!
                <br />
            </h2>
            {<CountdownTimer nextTriggerTime={nextTriggerTime} setHasWon={setHasWon} setIsCorrect={setIsCorrect} />}
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
                            {oneBook?.hint_2} It was released in{" "}
                            {oneBook?.release_year}
                        </Paper>
                    </div>
                    <div className="right-hint-bottom">
                        <Paper sx={{ backgroundColor: "#32354F", color: "white", height: "100%", display: "flex", justifyContent: "center", alignItems: "center" }} elevation={8}>
                            It was written by {oneBook?.author}
                        </Paper>
                    </div>
                </div>
            </div>
            <h3 style={{ width: "50%", cursor: "default" }}>{oneBook?.description}</h3>
        </div >
    )
}
export default ReturningWinner
