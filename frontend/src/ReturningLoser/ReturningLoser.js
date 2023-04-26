import React, { useState, useEffect } from "react"

import CountdownTimer from "../CountdownTimer/CountdownTimer.tsx"

const ReturningLoser = ({ oneBook, nextTriggerTime, setHasWon, setIsCorrect }) => {
    return (
        <div className="guess-container">
            <h2>
                You didn't get the answer today
                <br />
                {<CountdownTimer nextTriggerTime={nextTriggerTime} setHasWon={setHasWon} setIsCorrect={setIsCorrect} />}
            </h2>
            <h2>
                The correct answer was{" "}
                <span style={{ color: "red" }}>{oneBook?.title}</span> by{" "}
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
                        width: "350px",
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
            <p style={{ width: "50%" }}>{oneBook?.description}</p>
        </div>
    )
}
export default ReturningLoser
