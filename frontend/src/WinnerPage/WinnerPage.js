import React, { useState, useEffect } from "react"
import Confetti from "react-confetti";
import Paper from "@mui/material/Paper"

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
            <h2 style={{ cursor: "default" }}>You got it!</h2>
            <h2 style={{ cursor: "default" }}>
                The correct answer was{" "}
                <span style={{ color: "green", cursor: "default" }}>{oneBook?.title}</span> by{" "}
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
                    <div className="left-hint-top">
                        <Paper sx={{ backgroundColor: "#1f244a", color: "white", padding: "15px" }} variant="outlined" elevation={8}>
                            {oneBook?.hint_1}
                        </Paper>
                    </div>
                    <div className="left-hint-bottom">
                        <Paper sx={{ backgroundColor: "#1f244a", color: "white", padding: "15px" }} variant="outlined" elevation={3}>
                            {oneBook?.hint_3}
                        </Paper>
                    </div>
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
                    <div className="right-hint-top">
                        <Paper sx={{ backgroundColor: "#1f244a", color: "white", padding: "15px" }} variant="outlined" elevation={3}>
                            {oneBook?.hint_2}. It was released in{" "}
                            {oneBook?.release_year}
                        </Paper>
                    </div>
                    <div className="right-hint-bottom">
                        <Paper sx={{ backgroundColor: "#1f244a", color: "white", padding: "15px" }} variant="outlined" elevation={3}>
                            It was written by {oneBook?.author}
                        </Paper>
                    </div>
                </div>
            </div>
            <h3 style={{ width: "50%", cursor: "default" }}>{oneBook?.description}</h3>
        </div>
    )
}

export default WinnerPage
