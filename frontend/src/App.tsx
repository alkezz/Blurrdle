import React, { useState, useEffect } from "react";
import MainPage from "./MainPage/MainPage";
import WinnerPage from "./WinnerPage/WinnerPage";
import LoserPage from "./LoserPage/LoserPage";
import ReturningWinner from "./ReturningWinner/ReturningWinner";
import ReturningLoser from "./ReturningLoser/ReturningLoser";
import CountdownTimer from "./CountdownTimer/CountdownTimer.tsx";
import InfoIcon from "@mui/icons-material/Info";
import LeaderboardIcon from "@mui/icons-material/Leaderboard";
import Tooltip from "@mui/material/Tooltip";
import Modal from "@mui/material/Modal";
import GitHubIcon from "@mui/icons-material/GitHub";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import NewReleasesIcon from "@mui/icons-material/NewReleases";
import Grow from "@mui/material/Grow";
import useWebSocket from "react-use-websocket";
import { v4 as uuidv4 } from "uuid";
import "./App.css";

function App(): JSX.Element | null {
  const { lastMessage } = useWebSocket("wss://blurrdle-backend.onrender.com");
  const [isCorrect, setIsCorrect] = useState<boolean>(false);
  const [oneBook, setOneBook] = useState<object>({});
  const [time, setTime] = useState<number>();
  const [inputValue, setInputValue] = useState<string>("");
  const [hasWon, setHasWon] = useState<boolean | null>(null);
  const [userGuess, setUserGuess] = useState<string>();
  const [lives, setLives] = useState<number>(5);
  const [screenShake, setScreenShake] = useState<boolean>(false);
  const [showHint, setShowHint] = useState<number>(0);
  const [open, setOpen] = useState<boolean>(false);
  const [isSelected, setIsSelected] = useState<boolean>(false);
  const [isHintOneVisible, setIsHintOneVisible] = useState<boolean>(false);
  const [isHintTwoVisible, setIsHintTwoVisible] = useState<boolean>(false);
  const [isError, setIsError] = useState<boolean>(false);
  const [showStats, setShowStats] = useState<boolean>(false);
  useEffect(() => {
    if (
      localStorage.getItem("timeLeft") &&
      new Date().toISOString() >= localStorage.getItem("timeLeft")
    ) {
      const playerStats = JSON.parse(localStorage.getItem("player_stats"));
      playerStats.guesses_today = 0;
      localStorage.setItem("hasWon", "has not played");
      localStorage.setItem("player_stats", JSON.stringify(playerStats));
      localStorage.setItem("lives", "5");
      localStorage.setItem("hint", "0");
      localStorage.removeItem("timeLeft");
      setHasWon(null);
      setIsCorrect(false);
    }
    const getMessage = async () => {
      if (lastMessage !== null) {
        const { book, nextUpdateTime } = await JSON.parse(lastMessage.data);
        if (book) {
          setOneBook(book);
        }
        if (nextUpdateTime) {
          if (!localStorage.getItem("timeLeft"))
            localStorage.setItem("timeLeft", nextUpdateTime.toString());
          setTime(nextUpdateTime);
        }
      }
    };
    getMessage();
  }, [lastMessage]);
  useEffect(() => {
    const localStorageWinStatus = localStorage.getItem("hasWon");
    if (localStorageWinStatus === "true") {
      setHasWon(true);
    } else if (localStorageWinStatus === "false") {
      setHasWon(false);
    } else {
      setHasWon(null);
    }
    if (!localStorage.getItem("player_id")) {
      localStorage.setItem("player_id", uuidv4());
      const playerStats = {
        perfect_guesses: 0,
        games_played: 0,
        guesses: 0,
        guesses_today: 0,
        wins: 0,
        win_streak: 0,
        max_streak: 0,
      };
      const pastGames = [];
      localStorage.setItem("player_stats", JSON.stringify(playerStats));
      localStorage.setItem("past_games", JSON.stringify(pastGames));
      // localStorage.setItem("perfect_guesses", "0")
      // localStorage.setItem("games_played", "0")
      setOpen(true);
    }
    if (localStorage.getItem("lives")) {
      setLives(Number(localStorage.getItem("lives")));
    }
  }, [setLives]);
  useEffect(() => {
    if (Number(localStorage.getItem("hint")) > 0) {
      setShowHint(Number(localStorage.getItem("hint")));
    }
  }, [localStorage.getItem("hint"), setShowHint]);
  const handleModal = (): void => (open ? setOpen(false) : setOpen(true));
  const handleWin = (): void => {
    setIsCorrect(true);
    localStorage.setItem("hasWon", "true");
    const guesses = 5 - lives;
    const playerStats = JSON.parse(localStorage.getItem("player_stats"));
    const pastGames = JSON.parse(localStorage.getItem("past_games"));
    playerStats.wins += 1;
    playerStats.win_streak += 1;
    if (playerStats.win_streak > playerStats.max_streak)
      playerStats.max_streak = playerStats.win_streak;
    if (guesses === 0) {
      playerStats.perfect_guesses += 1;
      playerStats.guesses_today = guesses;
      playerStats.games_played += 1;
    } else {
      playerStats.guesses += guesses;
      playerStats.guesses_today = guesses;
      playerStats.games_played += 1;
    }
    pastGames.push(playerStats);
    localStorage.setItem("player_stats", JSON.stringify(playerStats));
    localStorage.setItem("past_games", JSON.stringify(pastGames));
  };
  const handleLoss = (): void => {
    localStorage.setItem("hasWon", "false");
    const playerStats = JSON.parse(localStorage.getItem("player_stats"));
    playerStats.win_streak = 0;
    playerStats.guesses += 5;
    playerStats.guesses_today = 5;
    playerStats.games_played += 1;
    localStorage.setItem("player_stats", JSON.stringify(playerStats));
  };
  const handleSubmit = (): void => {
    if (isError) setIsError(false);
    if (
      inputValue &&
      inputValue.toLowerCase() === oneBook?.title.toLowerCase()
    ) {
      handleWin();
    } else if (inputValue && lives > 1) {
      setLives(lives - 1);
      localStorage.setItem("lives", (lives - 1).toString());
      if (!isHintOneVisible) {
        setIsHintOneVisible(true);
      } else {
        setIsHintTwoVisible(true);
      }
      localStorage.setItem("hint", (showHint + 1).toString());
      setShowHint(Number(localStorage.getItem("hint")));
      setScreenShake(true);
      setUserGuess("");
      setTimeout(() => {
        setScreenShake(false);
      }, 500);
    } else if (inputValue && lives <= 1) {
      setLives(lives - 1);
      handleLoss();
    } else {
      setIsError(true);
      setScreenShake(true);
      setTimeout(() => {
        setScreenShake(false);
      }, 500);
    }
    setInputValue("");
    setIsSelected(false);
  };

  useEffect(() => {
    if (screenShake) {
      document.body.className = "shake-screen";
    } else {
      document.body.className = "";
    }
  }, [screenShake]);
  if (!oneBook) return null;
  if (!time) return null;
  return (
    <>
      <div className="modal-container">
        <Modal
          open={open}
          onClose={handleModal}
          style={{
            display: "flex",
            justifyContent: "center",
            height: "fit-content",
          }}
        >
          <Grow in={open}>
            <div className="modal-content">
              <p>👋 Hello and welcome to Blurrdle!</p>
              <p>
                Blurrdle is a mash-up between the beloved game "Wordle" and all
                the other "dle" games like{" "}
                <a
                  rel="noreferrer"
                  href="https://globle-game.com/"
                  target="_blank"
                >
                  Globle
                </a>
                ,{" "}
                <a
                  rel="noreferrer"
                  href="https://oec.world/en/tradle/"
                  target="_blank"
                >
                  Tradle
                </a>
                , and{" "}
                <a
                  rel="noreferrer"
                  href="https://www.gamedle.wtf/#"
                  target="_blank"
                >
                  Gamedle
                </a>{" "}
                but based on books!
              </p>
              <p>
                The objective is to guess the book based on clues and a blurry
                image of the cover.
              </p>
              <h3 style={{ marginBottom: "-10px" }}>How to play:</h3>
              <ol>
                <li>
                  You have 5 lives, every time you guess a book title wrong you
                  lose a life
                </li>
                {/* <li>You are given a blurry image of the book cover at first</li> */}
                <li>
                  After each wrong guess a hint will appear. You will get 4
                  hints including the book author
                </li>
              </ol>
              Keep going until you either lose all of your lives or you get the
              book right. Good luck!
              <div>
                <br />
                <Tooltip title="Github" arrow>
                  <a
                    rel="noreferrer"
                    href="https://www.github.com/alkezz"
                    target="_blank"
                  >
                    <GitHubIcon sx={{ fontSize: "28px" }} />
                  </a>
                </Tooltip>
                &nbsp; &nbsp; &nbsp;
                <Tooltip title="LinkedIn" arrow>
                  <a
                    rel="noreferrer"
                    href="https://www.linkedin.com/in/ali-k-ezzeddine"
                    target="_blank"
                  >
                    <LinkedInIcon sx={{ fontSize: "28px" }} />
                  </a>
                </Tooltip>
                &nbsp; &nbsp; &nbsp;
                <Tooltip title="Portfolio" arrow>
                  <a
                    rel="noreferrer"
                    href="https://www.ali-ezzeddine.com"
                    target="_blank"
                  >
                    <NewReleasesIcon sx={{ fontSize: "28px" }} />
                  </a>
                </Tooltip>
              </div>
            </div>
          </Grow>
        </Modal>
      </div>
      <div className="abc">
        <h1 style={{ cursor: "default" }}>
          Welcome to Blurrdle! &nbsp;
          <Tooltip title="More Info">
            <InfoIcon
              className="info-icon"
              onClick={handleModal}
              sx={{ cursor: "pointer" }}
            />
          </Tooltip>
          &nbsp;
          <Tooltip title="Stats">
            <LeaderboardIcon
              onClick={(e) => setShowStats(true)}
              sx={{ cursor: "pointer" }}
              className="info-icon"
            />
          </Tooltip>
        </h1>
        <div className="full-page-container">
          {lives > 0 &&
            !isCorrect &&
            oneBook?.blurred_cover &&
            hasWon === null && (
              <MainPage
                isSelected={isSelected}
                setIsSelected={setIsSelected}
                inputValue={inputValue}
                setInputValue={setInputValue}
                oneBook={oneBook}
                showHint={showHint}
                screenShake={screenShake}
                lives={lives}
                handleSubmit={handleSubmit}
                isError={isError}
              />
            )}
          {lives > 0 && isCorrect && oneBook?.book_cover && hasWon === null && (
            <WinnerPage
              oneBook={oneBook}
              nextTriggerTime={time}
              setHasWon={setHasWon}
              setIsCorrect={setIsCorrect}
            />
          )}
          {lives === 0 && hasWon === null && (
            <LoserPage
              oneBook={oneBook}
              nextTriggerTime={time}
              setHasWon={setHasWon}
              setIsCorrect={setIsCorrect}
            />
          )}
          {hasWon && (
            <ReturningWinner
              nextTriggerTime={time}
              setHasWon={setHasWon}
              setIsCorrect={setIsCorrect}
              oneBook={oneBook}
              showStats={showStats}
              setShowStats={setShowStats}
            />
          )}
          {hasWon === false && (
            <ReturningLoser
              oneBook={oneBook}
              nextTriggerTime={time}
              setHasWon={setHasWon}
              setIsCorrect={setIsCorrect}
            />
          )}
        </div>
        {hasWon === null && (
          <CountdownTimer
            nextTriggerTime={time}
            setHasWon={setHasWon}
            setIsCorrect={setIsCorrect}
          />
        )}
      </div>
    </>
  );
}

export default App;
