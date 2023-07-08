import React, { useState, useEffect } from "react"
import CountdownTimer from "../CountdownTimer/CountdownTimer.tsx"
const ReturningWinner = ({ oneBook, nextTriggerTime, setHasWon, setIsCorrect }) => {
    const playerStats = JSON.parse(localStorage.getItem("player_stats"));
    return (
        <div className="guess-container">
            <h2 style={{ marginBottom: "-20px" }}>You got it {playerStats.guesses_today === 0 ? <span style={{ color: "green" }}>first try you book worm</span> : <span>in <span style={{ color: "green" }}>{playerStats.guesses_today}</span> guesses</span>}!</h2>
            <h2>
                The correct answer was{" "}
                <span style={{ color: "green" }}>{oneBook?.title}</span> by{" "}
                {oneBook?.author}!
                <br />
                {<CountdownTimer nextTriggerTime={nextTriggerTime} setHasWon={setHasWon} setIsCorrect={setIsCorrect} />}
            </h2>
            {/* {localStorage.getItem("guesses") === "0" && (
                <span>You needed no hints you book worm, nice job!</span>
            )}
            {localStorage.getItem("guesses") !== "0" && (
                <span>
                    You got it in {localStorage.getItem("guesses")} guesses.
                </span>
            )} */}
            <br />
            <div style={{ display: "flex" }}>
                <div
                    style={{
                        display: "flex",
                        flexDirection: "column",
                        width: "100%"
                    }}
                >
                    <div className="left-hint">{oneBook?.hint_1}</div>
                    <div className="left-hint">{oneBook?.hint_3}</div>
                </div>
                <div>
                    <img
                        alt="book cover"
                        className="no-blur"
                        src={oneBook?.book_cover}
                    />
                </div>
                <div
                    style={{
                        display: "flex",
                        flexDirection: "column",
                        width: "100%"
                    }}
                >
                    <div className="right-hint">
                        {oneBook?.hint_2}. It was released in{" "}
                        {oneBook?.release_year}
                    </div>
                    <div className="right-hint">
                        It was written by {oneBook?.author}
                    </div>
                </div>
            </div>
            <h3 style={{ width: "50%" }}>{oneBook?.description}</h3>
        </div>
    )
}
export default ReturningWinner
