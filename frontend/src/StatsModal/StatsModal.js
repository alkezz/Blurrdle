import React, { useEffect, useState } from 'react';
import Grow from "@mui/material/Grow";
import Modal from "@mui/material/Modal";
import { CircularProgressbar } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';

const StatsModal = ({ showStats, setShowStats }) => {
    const playerStats = JSON.parse(localStorage.getItem("player_stats"));
    const [winPercent, setWinPercent] = useState(0);
    const handleModal = () => (showStats ? setShowStats(false) : setShowStats(true));
    useEffect(() => {
        setShowStats(true);
    }, [])
    useEffect(() => {
        //setTimeout is used so every .50s it'll increase by 1
        setTimeout(() => {
            if (winPercent < Math.floor((playerStats.wins / playerStats.games_played) * 100)) {
                setWinPercent(winPercent + 1);
            }
        }, 10);
    }, [winPercent, playerStats.wins, playerStats.games_played]);
    return (
        <div className="modal-container">
            <Modal
                open={showStats}
                onClose={handleModal}
                style={{ display: "flex", justifyContent: "center", height: "fit-content" }}
            >
                <Grow in={showStats}>
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
                                <h3 style={{ marginBottom: "15px" }}>{playerStats.games_played}</h3>
                                <h3>{playerStats.perfect_guesses}</h3>
                                {/* <h4>{(playerStats.wins / playerStats.games_played) * 100}%</h4> */}
                                {/* <CircularProgressbar
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
                                    value={winPercent} /> */}
                                <h3>{winPercent}%</h3>
                                <h3>{playerStats.win_streak}</h3>
                                <h3>{playerStats.max_streak}</h3>
                            </div>
                        </div>
                        {/* <h2 style={{ marginBottom: "-20px", cursor: "default" }}>You got it {playerStats.guesses_today === 0 ? <span style={{ color: "green" }}>first try!</span> : <span>in <span style={{ color: "green" }}>{playerStats.guesses_today}</span> guesses!</span>}</h2> */}
                        {/* <br />
                            <br />
                            <div style={{ display: "flex", justifyContent: "center", width: "100%" }}>
                                <CountdownTimer nextTriggerTime={nextTriggerTime} setHasWon={setHasWon} setIsCorrect={setIsCorrect} />
                            </div> */}
                    </div>
                </Grow>
            </Modal>
        </div>
    )
}

export default StatsModal;
