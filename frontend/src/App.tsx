import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import "./App.css";
import data from "./BookData/bookData.json";
import AutocompleteSearchBox from "./AutoComplete/AutoCompleteSearchBox";
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
import * as dataActions from "./store/UpdateBook";
import { v4 as uuidv4 } from "uuid";

function App(): JSX.Element {
  const { lastMessage } = useWebSocket("ws://localhost:8000");
  const [windowDimension, setWindowDimension] = useState<object>({
    width: window.innerWidth,
    height: window.innerHeight,
  });
  const [scores, setScores] = useState<object>({});
  const dispatch = useDispatch();
  // const data = useSelector((state) => state.data);
  // console.log(data, "DATA");
  const [isCorrect, setIsCorrect] = useState<boolean>(false);
  const [book, setBook] = useState<object>({});
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
  // const localStorageWinStatus = localStorage.getItem("hasWon");
  // if (localStorageWinStatus === "true") setIsCorrect(true);
  // if (!localStorage.getItem("player_id")) {
  //   localStorage.setItem("player_id", uuidv4());
  // }
  // useEffect(() => {
  //   const socket = socketIOClient("http://localhost:8000");
  //   socket.on("connect", () => {
  //     console.log("SOCKET READY ");
  //   });
  //   socket.on("dataReady", (data) => {
  //     dispatch(dataActions.updateData(data));
  //   });
  // }, [dispatch]);
  useEffect(() => {
    if (lastMessage !== null) {
      const { book, timeRemaining, type, scores } = JSON.parse(
        lastMessage.data
      );
      if (book) setBook(book);
      if (timeRemaining) setTime(timeRemaining);
      if (scores) setScores(scores);
    }
  }, [lastMessage, book, setTime, setBook, time, setScores]);
  useEffect(() => {
    const localStorageWinStatus = localStorage.getItem("hasWon");
    if (localStorageWinStatus === "true") setHasWon(true);
    if (localStorageWinStatus === "false") setHasWon(false);
    if (!localStorage.getItem("player_id")) {
      localStorage.setItem("player_id", uuidv4());
      setOpen(true);
    }
  }, []);
  useEffect(() => {
    window.addEventListener("resize", detectSize);
    return () => {
      window.removeEventListener("resize", detectSize);
    };
  }, [windowDimension]);
  const handleModal = (): void => (open ? setOpen(false) : setOpen(true));
  const handleWin = (): void => {
    setIsCorrect(true);
    localStorage.setItem("hasWon", "true");
    const guesses = 5 - lives;
    localStorage.setItem("guesses", guesses.toString());
    const { sendJsonMessage } = useWebSocket("ws://localhost:8080");
    sendJsonMessage({
      type: "updateScore",
      playerId: localStorage.getItem("player_id"),
      score: guesses,
    });
  };
  const handleLoss = (): void => {
    localStorage.setItem("hasWon", "false");
    const { sendJsonMessage } = useWebSocket("ws://localhost:8080");
    sendJsonMessage({
      type: "updateScore",
      playerId: localStorage.getItem("player_id"),
      score: 0,
    });
  };
  const handleSubmit = (): void => {
    if (inputValue && inputValue.toLowerCase() === book?.title.toLowerCase()) {
      handleWin();
    } else if (lives > 1) {
      setLives(lives - 1);
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
            <p>👋 Hello! My name is Ali Ezzeddine and welcome to Bookle!</p>
            <p>
              Bookle is a mash-up between the beloved game "Wordle" and all the
              other "dle" games like{" "}
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
                You are given a blurry image of the book cover, how many words
                are in the title, and the average rating (from OpenLibrary)
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
        {time}
        <div className="full-page-container">
          {lives > 0 &&
            !isCorrect &&
            book?.blurred_cover &&
            hasWon === null && (
              <div className="guess-container">
                <span style={{ fontSize: "22px" }}>
                  Title: {book?.title.split(" ").length} Words
                </span>
                <br />
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
                      <div className="left-hint">{book?.hint_1}</div>
                    )}
                    {showHint >= 3 && (
                      <div className="left-hint">{book?.hint_3}</div>
                    )}
                  </div>
                  <div>
                    <img
                      alt="book cover"
                      className="no-blur"
                      src={book?.blurred_cover}
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
                        {book?.hint_2}. It was released in {book?.release_year}
                      </div>
                    )}
                    {showHint >= 4 && (
                      <div className="right-hint">
                        It was written by {book?.author}
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
          {lives > 0 && isCorrect && book?.book_cover && hasWon === null && (
            <div className="guess-container">
              <Confetti
                width={windowDimension.width}
                height={windowDimension.height}
              />
              <h2>You got it!</h2>
              <h2>
                The correct answer was{" "}
                <span style={{ color: "green" }}>{book?.title}</span> by{" "}
                {book?.author}!
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
                  <div className="left-hint">{book?.hint_1}</div>
                  <div className="left-hint">{book?.hint_3}</div>
                </div>
                <div>
                  <img
                    alt="book cover"
                    className="no-blur"
                    src={book?.book_cover}
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
                    {book?.hint_2}. It was released in {book?.release_year}
                  </div>
                  <div className="right-hint">
                    It was written by {book?.author}
                  </div>
                </div>
              </div>
              <h3 style={{ width: "50%" }}>{book?.description}</h3>
            </div>
          )}
          {lives === 0 && hasWon === null && (
            <div className="guess-container">
              <h2>Too bad! You didn't get the book right!</h2>
              <h2>
                The correct answer was{" "}
                <span style={{ color: "red" }}>{book?.title}</span> by{" "}
                {book?.author}
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
                  <div className="left-hint">{book?.hint_1}</div>
                  <div className="left-hint">{book?.hint_3}</div>
                </div>
                <div>
                  <img
                    alt="book cover"
                    className="no-blur"
                    src={book?.book_cover}
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
                    {book?.hint_2}. It was released in {book?.release_year}
                  </div>
                  <div className="right-hint">
                    It was written by {book?.author}
                  </div>
                </div>
              </div>
              <p style={{ width: "50%" }}>{book?.description}</p>
            </div>
          )}
          {hasWon && (
            <div className="guess-container">
              <h2 style={{ marginBottom: "-20px" }}>You got it!</h2>
              <h2>
                The correct answer was{" "}
                <span style={{ color: "green" }}>{book?.title}</span> by{" "}
                {book?.author}!
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
                  <div className="left-hint">{book?.hint_1}</div>
                  <div className="left-hint">{book?.hint_3}</div>
                </div>
                <div>
                  <img
                    alt="book cover"
                    className="no-blur"
                    src={book?.book_cover}
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
                    {book?.hint_2}. It was released in {book?.release_year}
                  </div>
                  <div className="right-hint">
                    It was written by {book?.author}
                  </div>
                </div>
              </div>
              <h3 style={{ width: "50%" }}>{book?.description}</h3>
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
                <span style={{ color: "red" }}>{book?.title}</span> by{" "}
                {book?.author}
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
                  <div className="left-hint">{book?.hint_1}</div>
                  <div className="left-hint">{book?.hint_3}</div>
                </div>
                <div>
                  <img
                    alt="book cover"
                    className="no-blur"
                    src={book?.book_cover}
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
                    {book?.hint_2}. It was released in {book?.release_year}
                  </div>
                  <div className="right-hint">
                    It was written by {book?.author}
                  </div>
                </div>
              </div>
              <p style={{ width: "50%" }}>{book?.description}</p>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default App;
