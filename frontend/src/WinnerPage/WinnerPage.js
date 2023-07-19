import React, { useState, useEffect } from "react"
import CountdownTimer from "../CountdownTimer/CountdownTimer.tsx"
import Modal from "@mui/material/Modal";
import { CircularProgressbar } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import Confetti from "react-confetti";
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import Paper from "@mui/material/Paper"

const WinnerPage = ({ oneBook, nextTriggerTime, setHasWon, setIsCorrect, setShowStats, showStats }) => {
    const playerStats = JSON.parse(localStorage.getItem("player_stats"));
    const titleLink = oneBook.title.split(" ").join("_")
    const [windowDimension, setWindowDimension] = useState({
        width: window.innerWidth,
        height: window.innerHeight,
    });
    const [winPercent, setWinPercent] = useState(0)
    const handleModal = () => (showStats ? setShowStats(false) : setShowStats(true));
    const detectSize = () => {
        setWindowDimension({
            width: window.innerWidth,
            height: window.innerHeight,
        });
    };
    useEffect(() => {
        //setTimeout is used so every .50s it'll increase by 1
        setTimeout(() => {
            if (winPercent < Math.floor((playerStats.wins / playerStats.games_played) * 100)) {
                setWinPercent(winPercent + 1);
            }
        }, 10);
    }, [winPercent, playerStats.wins, playerStats.games_played]);
    useEffect(() => {
        window.addEventListener("resize", detectSize);
        return () => {
            window.removeEventListener("resize", detectSize);
        };
    }, [windowDimension]);
    return (
        <>
            <div className="modal-container">
                <Modal
                    open={showStats}
                    onClose={handleModal}
                    style={{ display: "flex", justifyContent: "center", height: "fit-content" }}
                >
                    <div className='modal-content'>
                        <h1>Statistics</h1>
                        <div className='raw-stats'>
                            <div className='stat-headers'>
                                <h3>Games Played:</h3>
                                <h3>Perfect Games:</h3>
                                <h3>Win %:</h3>
                                <h3>Current Streak:</h3>
                                <h3>Max Streak:</h3>
                            </div>
                            <div className='stat-numbers'>
                                <h4 style={{ marginBottom: "15px" }}>{playerStats.games_played}</h4>
                                <h4>{playerStats.perfect_guesses}</h4>
                                {/* <h4>{(playerStats.wins / playerStats.games_played) * 100}%</h4> */}
                                <CircularProgressbar
                                    className='circle-progress'
                                    styles={{
                                        path: { stroke: "white" }, //Changing path color
                                        trail: {
                                            // Trail color
                                            stroke: '#1e2030',
                                            // Whether to use rounded or flat corners on the ends - can use 'butt' or 'round'
                                        },
                                        text: { fill: "white", fontSize: "30px" } //Changing text color
                                    }} strokeWidth={6}
                                    text={`${winPercent}%`}
                                    value={winPercent} />
                                <h4>{playerStats.win_streak}</h4>
                                <h4>{playerStats.max_streak}</h4>
                            </div>
                        </div>
                        <br />
                        <div style={{ display: "flex", justifyContent: "center", width: "100%" }}>
                            <CountdownTimer nextTriggerTime={nextTriggerTime} setHasWon={setHasWon} setIsCorrect={setIsCorrect} />
                        </div>
                    </div>
                </Modal>
            </div>
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
                {<CountdownTimer nextTriggerTime={nextTriggerTime} setHasWon={setHasWon} setIsCorrect={setIsCorrect} />}
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
                    <h3 style={{ width: "850px", cursor: "pointer" }}>{oneBook?.description} <OpenInNewIcon style={{ marginTop: "10px" }} /></h3>
                </a>
            </div>
        </>
    )
}

export default WinnerPage
