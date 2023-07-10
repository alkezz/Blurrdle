import React from "react"
import CountdownTimer from "../CountdownTimer/CountdownTimer.tsx"
import Paper from "@mui/material/Paper"

const ReturningLoser = ({ oneBook, nextTriggerTime, setHasWon, setIsCorrect }) => {
    return (
        <div className="guess-container">
            <h2 style={{ cursor: "default" }}>
                You didn't get the answer today
                <br />
            </h2>
            <h2 style={{ cursor: "default" }}>
                The correct answer was{" "}
                <span style={{ color: "red", cursor: "default" }}>{oneBook?.title}</span> by{" "}
                {oneBook?.author}
            </h2>
            <CountdownTimer nextTriggerTime={nextTriggerTime} setHasWon={setHasWon} setIsCorrect={setIsCorrect} />
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
            <p style={{ width: "50%", cursor: "default" }}>{oneBook?.description}</p>
        </div>
    )
}
export default ReturningLoser
