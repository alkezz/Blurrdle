import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import "./App.css";
import data from "./BookData/bookData.json";
import AutocompleteSearchBox from "./AutoComplete/AutoCompleteSearchBox";
import CountdownTimer from "./CountdownTimer/CountdownTimer.tsx";
import InfoIcon from "@mui/icons-material/Info";
import Tooltip from "@mui/material/Tooltip";
import Modal from "@mui/material/Modal";
import FavoriteIcon from "@mui/icons-material/Favorite";
import GitHubIcon from "@mui/icons-material/GitHub";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import NewReleasesIcon from "@mui/icons-material/NewReleases";
import Confetti from "react-confetti";
import socketIOClient from "socket.io-client";
import useWebSocket from "react-use-websocket";
import * as bookActions from "./store/UpdateBook";
import { v4 as uuidv4 } from "uuid";

function App(): JSX.Element | null {
  const { lastMessage } = useWebSocket("ws://localhost:8000");
  const { sendJsonMessage } = useWebSocket("ws://localhost:8000");
  const [windowDimension, setWindowDimension] = useState<object>({
    width: window.innerWidth,
    height: window.innerHeight,
  });
  const [scores, setScores] = useState<object>({});
  const dispatch = useDispatch();
  const prevBook = useSelector((state) => state);
  // console.log(prevBook);
  const [isCorrect, setIsCorrect] = useState<boolean>(false);
  const [oneBook, setOneBook] = useState<object>({});
  const [time, setTime] = useState<number>();
  const [stringTime, setStringTime] = useState<string>("");
  const [timeLeft, setTimeLeft] = useState<string>();
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
  const calculateTime = (secs) => {
    const minutes = Math.floor(secs / 60);
    const returnedMins = minutes < 10 ? `0${minutes}` : `${minutes}`;
    const seconds = Math.floor(secs % 60);
    const returnedSeconds = seconds < 10 ? `0${seconds}` : `${seconds}`;
    return `${returnedMins}:${returnedSeconds}`;
  };
  // useEffect(() => {
  //   if (prevBook) {
  //     setOneBook(prevBook.book.data);
  //   } else {
  //     if (lastMessage !== null) {
  //       const { book, timeRemaining, type, scores } = JSON.parse(
  //         lastMessage.data
  //       );
  //       if (book) {
  //         if (oneBook.title !== book.title) {
  //           const book = dispatch(bookActions.getData());
  //           setOneBook(book.payload);
  //           if (
  //             localStorage.getItem("hasWon") === "true" ||
  //             localStorage.getItem("hasWon") === "false"
  //           ) {
  //             localStorage.setItem("hasWon", "has not played");
  //             setHasWon(null);
  //           }
  //         }
  //       }
  //       if (timeRemaining) setTime(timeRemaining);
  //       if (scores) setScores(scores);
  //     }
  //   }
  // }, [prevBook]);
  // useEffect(() => {
  //   if (lastMessage !== null) {
  //     handleWebSocketMessage(lastMessage.data);
  //   }
  //   function handleWebSocketMessage(event) {
  //     const data = JSON.parse(event);
  //     if (data.book && (!prevBook || prevBook.book.title !== data.book.title)) {
  //       const book = dispatch(bookActions.uploadBook(data.book));
  //       setOneBook(book.payload);
  //       setHasWon(null);
  //       setIsCorrect(false);
  //       localStorage.removeItem("hasWon");
  //     }
  //   }
  // }, [lastMessage]);

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
  // setTimeout(() => {
  //   if (time) {
  //     console.log("TIME", time);
  //     const currTime = new Date();
  //     const timeWhenCronFires = new Date(time);
  //     const timeDiffInMs = timeWhenCronFires - currTime;
  //     const timeDiffInMin = Math.floor(timeDiffInMs / 1000 / 60);
  //     console.log("kjesdfl", timeDiffInMs);
  //     setStringTime(calculateTime);
  //   }
  // }, 1000);
  // useEffect(() => {
  //   if (time && time > 0) {
  //     setTimeout(() => {
  //       setTime(time - 1);
  //       setTimeLeft(calculateTime(time));
  //     }, 1000);
  //   }
  // });
  // useEffect(() => {
  //   if (Object.keys(oneBook).length === 0) {
  //     const book = dispatch(bookActions.getData());
  //     setOneBook(book.payload);
  //   }
  // }, [setOneBook]);
  useEffect(() => {
    const localStorageWinStatus = localStorage.getItem("hasWon");
    if (localStorageWinStatus === "true") setHasWon(true);
    if (localStorageWinStatus === "false") setHasWon(false);
    if (!localStorage.getItem("player_id")) {
      localStorage.setItem("player_id", uuidv4());
      setOpen(true);
    }
    if(localStorage.getItem("lives")){
      setLives(Number(localStorage.getItem("lives")))
    }
  }, [setLives]);
  useEffect(() => {
    window.addEventListener("resize", detectSize);
    return () => {
      window.removeEventListener("resize", detectSize);
    };
  }, [windowDimension]);
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
      localStorage.setItem("lives", (lives - 1).toString())
      // localStorage.setItem("lives", lives.toString())
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
  // console.log("oneBook", oneBook);
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
            <p>👋 Hello! My name is Ali Ezzeddine and welcome to Blurrdle!</p>
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
                Gamdle
              </a>
            </p>
            <p>
              The objective is to guess the book based on clues in 5 guesses.
            </p>
            <h3>How to play:</h3>
            <ol>
              <li>
                You have 5 lives, every time you guess a book title wrong you
                lose a life
              </li>
              <li>
                You are given a blurry image of the book cover at first
              </li>
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
                  href="https://www.linkedin.com/in/ali-ezzeddine-17b2b6248/"
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
        {/* <button onClick={handleNewBook}>newBook</button> */}
        <h1>Welcome to Blurrdle!
          &nbsp;
          <Tooltip title='More Info'>
            <InfoIcon className="info-icon" onClick={handleModal} sx={{cursor: "pointer"}} />
          </Tooltip>
          </h1>
        <CountdownTimer
          nextTriggerTime={time}
          setHasWon={setHasWon}
          setIsCorrect={setIsCorrect}
        />
        <div className="full-page-container">
          {lives > 0 &&
            !isCorrect &&
            oneBook?.blurred_cover &&
            hasWon === null && (
              <div className="guess-container">
                {/* <span style={{ fontSize: "22px" }}>
                  Title: {oneBook?.title.split(" ").length} Words
                </span> */}
                {/* <br /> */}
                <AutocompleteSearchBox
                  isSelected={isSelected}
                  setIsSelected={setIsSelected}
                  inputValue={inputValue}
                  setInputValue={setInputValue}
                />
                <br />
                <button className="submit-button" onClick={handleSubmit}>
                  SUBMIT
                </button>
                <br />
                <h2>Can you guess this book?</h2>
                <div style={{ display: "flex" }}>
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      marginTop: "10%",
                      width: "350px",
                    }}
                  >
                    {showHint >= 1 && (
                      <div className="left-hint">{oneBook?.hint_1}</div>
                    )}
                    {showHint >= 3 && (
                      <div className="left-hint">{oneBook?.hint_3}</div>
                    )}
                  </div>
                  <div>
                    <img
                      alt="book cover"
                      className="no-blur"
                      src={oneBook?.blurred_cover}
                    />
                  </div>
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      marginTop: "10%",
                      width: "350px",
                    }}
                  >
                    {showHint >= 2 && (
                      <div className="right-hint">
                        {oneBook?.hint_2}. It was released in{" "}
                        {oneBook?.release_year}
                      </div>
                    )}
                    {showHint >= 4 && (
                      <div className="right-hint">
                        It was written by {oneBook?.author}
                      </div>
                    )}
                  </div>
                </div>
                <div style={{ marginTop: "15px" }}>
                  {[...Array(lives)].map((_, i) => (
                    <FavoriteIcon sx={{ color: "red", fontSize: "30px" }} />
                  ))}
                  {screenShake && <span className="falling-number">-1</span>}
                </div>
              </div>
            )}
          {lives > 0 && isCorrect && oneBook?.book_cover && hasWon === null && (
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
                    marginTop: "10%",
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
                    marginTop: "10%",
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
              <h3 style={{ width: "50%" }}>{oneBook?.description}</h3>
            </div>
          )}
          {lives === 0 && hasWon === null && (
            <div className="guess-container">
              <h2>Too bad! You didn't get the book right!</h2>
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
                    marginTop: "10%",
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
                    marginTop: "10%",
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
          )}
          {hasWon && (
            <div className="guess-container">
              <h2 style={{ marginBottom: "-20px" }}>You got it!</h2>
              <h2>
                The correct answer was{" "}
                <span style={{ color: "green" }}>{oneBook?.title}</span> by{" "}
                {oneBook?.author}!
                <br />
                Come back tomorrow for a new challenge!
              </h2>
              {localStorage.getItem("guesses") === "0" && (
                <span>You needed no hints you book worm, nice job!</span>
              )}
              {localStorage.getItem("guesses") !== "0" && (
                <span>
                  You got it in {localStorage.getItem("guesses")} guesses.
                </span>
              )}
              <br />
              <div style={{ display: "flex" }}>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    marginTop: "10%",
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
                    marginTop: "10%",
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
              <h3 style={{ width: "50%" }}>{oneBook?.description}</h3>
            </div>
          )}
          {hasWon === false && (
            <div className="guess-container">
              <h2>
                You didn't get the answer today
                <br />
                Come back again tomorrow to try a new challenge!
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
                    marginTop: "10%",
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
                    marginTop: "10%",
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
          )}
        </div>
      </div>
    </>
  );
}

export default App;
