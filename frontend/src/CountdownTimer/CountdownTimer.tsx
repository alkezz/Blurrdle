import React, { useEffect, useState } from "react";
import CircularProgress from "@mui/material/CircularProgress";

interface Props {
  nextTriggerTime: Date;
  setHasWon: Boolean | null;
  setIsCorrect: Boolean;
}

function CountdownTimer({ nextTriggerTime, setHasWon, setIsCorrect }: Props) {
  const [timeDifference, setTimeDifference] = useState<number | string>(0);
  // console.log(nextTriggerTime);
  // Define a function to update the time difference
  const updateTimeDifference = () => {
    // Get the current time
    const currentTime = new Date();

    // Calculate the time difference in milliseconds
    const difference =
      new Date(nextTriggerTime).getTime() - currentTime.getTime();

    // Check if the time difference is negative (i.e. the cron function has already fired)
    if (difference < 0) {
      setTimeDifference(0);
      return;
    }

    // Calculate the hours, minutes, and seconds
    const seconds = Math.floor(difference / 1000) % 60;
    const minutes = Math.floor(difference / 1000 / 60) % 60;
    const hours = Math.floor(difference / 1000 / 60 / 60);

    // Format the time difference as "HH:MM:SS"
    const formattedTime = `${hours.toString().padStart(2, "0")}:${minutes
      .toString()
      .padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;

    // Set the time difference as a string
    setTimeDifference(formattedTime);
  };

  // Use useEffect to update the time difference every second
  useEffect(() => {
    const interval = setInterval(updateTimeDifference, 1000);
    return () => clearInterval(interval);
  }, [nextTriggerTime]);
  // console.log(timeDifference);
  if (timeDifference === "00:00:00") {
    const playerStats = JSON.parse(localStorage.getItem("player_stats"));
    playerStats.guesses_today = 0;
    setTimeout(() => {
      window.location.reload();
      localStorage.setItem("hasWon", "has not played");
      localStorage.setItem("player_stats", JSON.stringify(playerStats));
      localStorage.setItem("lives", "5");
      localStorage.setItem("hint", "0");
      setHasWon(null);
      setIsCorrect(false);
    }, 1000);
  }
  if (!nextTriggerTime) return null;
  return (
    <div style={{ marginTop: "-35px" }}>
      <h3 style={{ cursor: "default" }}>
        Next Book Available In:{" "}
        {typeof timeDifference === "number" ? (
          <CircularProgress size={21} sx={{ color: "yellow" }} />
        ) : (
          <span style={{ color: "yellow", cursor: "default" }}>
            {timeDifference}
          </span>
        )}
      </h3>
    </div>
  );
}

export default CountdownTimer;
