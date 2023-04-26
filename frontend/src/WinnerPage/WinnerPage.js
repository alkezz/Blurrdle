import React, { useState, useEffect } from "react"
import Confetti from "react-confetti";

const WinnerPage = ({ oneBook }) => {
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
        <div className="guess-container">
            <Confetti
                width={windowDimension.width}
                height={windowDimension.height}
            />
            <h2>You got it!</h2>
            <h2>
                The correct answer was{" "}
                <span style={{ color: "green" }}>{oneBook?.title}</span> by{" "}
                {oneBook?.author}!
            </h2>
            <div style={{ display: "flex" }}>
                <div
                    style={{
                        display: "flex",
                        flexDirection: "column",
                        width: "100%",
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
                        width: "100%",
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

export default WinnerPage
