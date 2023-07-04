import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import "./App.css";
import MainPage from "./MainPage/MainPage";
import WinnerPage from "./WinnerPage/WinnerPage";
import LoserPage from "./LoserPage/LoserPage";
import ReturningWinner from "./ReturningWinner/ReturningWinner";
import ReturningLoser from "./ReturningLoser/ReturningLoser";
import CountdownTimer from "./CountdownTimer/CountdownTimer";
import InfoIcon from "@mui/icons-material/Info";
import Tooltip from "@mui/material/Tooltip";
import Modal from "@mui/material/Modal";
import GitHubIcon from "@mui/icons-material/GitHub";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import NewReleasesIcon from "@mui/icons-material/NewReleases";
import useWebSocket from "react-use-websocket";
import * as bookActions from "./store/UpdateBook";
import { v4 as uuidv4 } from "uuid";

function App(): JSX.Element | null {
  const { lastMessage } = useWebSocket("wss://blurrdle-backend.onrender.com");
  const { sendJsonMessage } = useWebSocket(
    "wss://blurrdle-backend.onrender.com"
  );
  const [windowDimension, setWindowDimension] = useState<object>({
    width: window.innerWidth,
    height: window.innerHeight,
  });
  const [scores, setScores] = useState<object>({});
  const dispatch = useDispatch();
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
  const detectSize = (): void => {
    setWindowDimension({
      width: window.innerWidth,
      height: window.innerHeight,
    });
  };
  useEffect(() => {
    if (lastMessage !== null) {
      const { book, nextUpdateTime, type, scores } = JSON.parse(
        lastMessage.data
      );
      if (book) setOneBook(book);
      if (nextUpdateTime) {
        console.log("UPDATE", nextUpdateTime);
        setTime(nextUpdateTime);
      }
      if (scores) setScores(scores);
    }
  }, [lastMessage]);
  useEffect(() => {
    const localStorageWinStatus = localStorage.getItem("hasWon");
    if (localStorageWinStatus === "true") setHasWon(true);
    if (localStorageWinStatus === "false") setHasWon(false);
    if (!localStorage.getItem("player_id")) {
      localStorage.setItem("player_id", uuidv4());
      setOpen(true);
    }
    if (localStorage.getItem("lives")) {
      setLives(Number(localStorage.getItem("lives")));
    }
  }, [setLives]);
  const handleNewBook = (): void => {
    const book = dispatch(bookActions.uploadBook());
    setOneBook(book.payload);
  };
  const handleModal = (): void => (open ? setOpen(false) : setOpen(true));
  const handleWin = (): void => {
    setIsCorrect(true);
    localStorage.setItem("hasWon", "true");
    const guesses = 5 - lives;
    localStorage.setItem("guesses", guesses.toString());
    sendJsonMessage({
      type: "updateScore",
      playerId: localStorage.getItem("player_id"),
      score: guesses,
    });
  };
  const handleLoss = (): void => {
    localStorage.setItem("hasWon", "false");
    sendJsonMessage({
      type: "updateScore",
      playerId: localStorage.getItem("player_id"),
      score: 0,
    });
  };
  const handleSubmit = (): void => {
    if (
      inputValue &&
      inputValue.toLowerCase() === oneBook?.title.toLowerCase()
    ) {
      handleWin();
    } else if (lives > 1) {
      setLives(lives - 1);
      localStorage.setItem("lives", (lives - 1).toString());
      if (!isHintOneVisible) {
        setIsHintOneVisible(true);
      } else {
        setIsHintTwoVisible(true);
      }
      setShowHint(showHint + 1);
      setScreenShake(true);
      setUserGuess("");
      setTimeout(() => {
        setScreenShake(false);
      }, 500);
    } else {
      setLives(lives - 1);
      handleLoss();
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
              </a>
              but based on books!
            </p>
            <p>
              The objective is to guess the book based on clues and a blurry
              image of the cover.
            </p>
            <h3>How to play:</h3>
            <ol>
              <li>
                You have 5 lives, every time you guess a book title wrong you
                lose a life
              </li>
              <li>You are given a blurry image of the book cover at first</li>
              <li>
                After each wrong guess a hint will appear. You will get 4 hints
                including the book author
              </li>
            </ol>
            Keep going until you either lose all your lives or you get the book
            right. Good luck!
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
        </Modal>
      </div>
      <div className="abc">
        <h1>
          Welcome to Blurrdle! &nbsp;
          <Tooltip title="More Info">
            <InfoIcon
              className="info-icon"
              onClick={handleModal}
              sx={{ cursor: "pointer" }}
            />
          </Tooltip>
        </h1>
        {hasWon === null && (
          <CountdownTimer
            nextTriggerTime={time}
            setHasWon={setHasWon}
            setIsCorrect={setIsCorrect}
          />
        )}
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
              />
            )}
          {lives > 0 && isCorrect && oneBook?.book_cover && hasWon === null && (
            <WinnerPage oneBook={oneBook} />
          )}
          {lives === 0 && hasWon === null && <LoserPage oneBook={oneBook} />}
          {hasWon && (
            <ReturningWinner
              nextTriggerTime={time}
              setHasWon={setHasWon}
              setIsCorrect={setIsCorrect}
              oneBook={oneBook}
            />
          )}
          {hasWon === false && <ReturningLoser oneBook={oneBook} />}
        </div>
      </div>
    </>
  );
}

export default App;
