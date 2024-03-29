import React from "react"
import CountdownTimer from "../CountdownTimer/CountdownTimer.tsx"
import Paper from "@mui/material/Paper"
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import StatsModal from "../StatsModal/StatsModal.js";
import { VictoryBar, VictoryChart } from "victory"

const ReturningLoser = ({ oneBook, nextTriggerTime, setHasWon, setIsCorrect, setShowStats, showStats }) => {
    const titleLink = oneBook.title.split(" ").join("_")
    return (
        <>
            <StatsModal setShowStats={setShowStats} showStats={showStats} />
            {<CountdownTimer nextTriggerTime={nextTriggerTime} setHasWon={setHasWon} setIsCorrect={setIsCorrect} />}
            <div className="guess-container">
                <h2 style={{ marginBottom: "-20px", cursor: "default" }}>
                    You didn't get the answer today
                    <br />
                </h2>
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
                {/*
                [{"perfect_guesses":0,"games_played":1,"guesses":2,"guesses_today":2,"wins":1,"win_streak":1,"max_streak":1},
                {"perfect_guesses":0,"games_played":2,"guesses":3,"guesses_today":1,"wins":2,"win_streak":2,"max_streak":2},
                {"perfect_guesses":1,"games_played":3,"guesses":3,"guesses_today":0,"wins":3,"win_streak":3,"max_streak":3},
                {"perfect_guesses":2,"games_played":4,"guesses":3,"guesses_today":0,"wins":4,"win_streak":4,"max_streak":4},
                {"perfect_guesses":2,"games_played":5,"guesses":6,"guesses_today":3,"wins":5,"win_streak":5,"max_streak":5},
                {"perfect_guesses":2,"games_played":7,"guesses":14,"guesses_today":3,"wins":6,"win_streak":1,"max_streak":5}]
                */}
                {/* <VictoryChart theme={VictoryTheme.material}>
                    <VictoryAxis
                        offsetY={50}
                        tickValues={pastPlayerStats.map((entry, index) => index)} // Use index as the x-axis value
                        tickFormat={pastPlayerStats.map((entry, index) => entry.guesses_today)} // Show guesses_today on the x-axis
                        label="Guesses Today"
                    />
                    <VictoryAxis
                        offsetX={40}
                        dependentAxis
                        label="Games Played"
                    />
                    <VictoryBar
                        data={pastPlayerStats}
                        x={(d, index) => index} // Use index as the x-axis value
                        y="games_played"
                        style={{
                            data: { width: 20, fill: 'white' }, // Increase the width and set the fill color
                            labels: { fontSize: 8 } // Optionally adjust the label font size
                        }}
                    />
                </VictoryChart>
                {console.log("PLAYERSTATS", pastPlayerStats)} */}
                <a rel="noreferrer" target='_blank' href={`https://en.wikipedia.org/wiki/${titleLink}`}>
                    <h3 style={{ width: "850px", cursor: "pointer" }}>{oneBook?.description}<OpenInNewIcon style={{ marginBottom: "-3px", fontSize: "20px" }} /></h3>
                </a>
            </div>
        </>
    )
}
export default ReturningLoser
