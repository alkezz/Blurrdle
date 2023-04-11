import React, { useState, useEffect } from 'react';
import './App.css';
import data from "./BookData/bookData.json"
import InfoIcon from '@mui/icons-material/Info';
import Rating from '@mui/material/Rating';
import Tooltip from '@mui/material/Tooltip';
import Modal from '@mui/material/Modal';
import FavoriteIcon from '@mui/icons-material/Favorite';
import GitHubIcon from '@mui/icons-material/GitHub';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import NewReleasesIcon from '@mui/icons-material/NewReleases';

function App(): JSX.Element {
  const [isCorrect, setIsCorrect] = useState<boolean>(false);
  const [userGuess, setUserGuess] = useState<string>('');
  const [lives, setLives] = useState<number>(5);
  const [screenShake, setScreenShake] = useState<boolean>(false);
  const [showHint, setShowHint] = useState<number>(0);
  const [open, setOpen] = useState<boolean>(false);

  const handleModal = (): void => open ? setOpen(false) : setOpen(true);
  const handleWin = (): void => {
    setIsCorrect(true);
  }
  const handleLoss = (): void => {

  }
  const handleSubmit = (): void => {
    if (userGuess.toLowerCase() === data.Books[0].title.toLowerCase()) {
      handleWin();
    } else {
      setLives(lives - 1);
      setShowHint(showHint + 1);
      setScreenShake(true);
      setTimeout(() => {
        setScreenShake(false);
      }, 500);
    }
  }

  useEffect(() => {
    if (lives === 0) {
      handleLoss();
    }
    if (screenShake) {
      document.body.className = "shake-screen";
    } else {
      document.body.className = "";
    }
  }, [lives, setLives, screenShake]);
  return (
    <>
      <Modal open={open} onClose={handleModal}>
        <div className='modal-container'>
          <p>Hello! My name is Ali Ezzeddine, thanks for checking out my app!</p>
          <p>I am a huge book worm and I adore Wordle so I thought why not combine the two!</p>
          <h3>How to play:</h3>
          <ol>
            <li>
              You have 5 lives, every time you guess a book title wrong you lose a life
            </li>
            <li>
              You are given a blurry image of the book cover, how many words are in the title, and the average rating (from OpenLibrary)
            </li>
            <li>
              After each wrong guess a hint will appear. You will get 4 hints including the book author
            </li>
          </ol>
          Keep going until you either lose all your lives or you get the book right. Good Luck!
          <div>
            <br />
            <Tooltip title='Github' arrow>
              <a rel="noreferrer" href='https://www.github.com/alkezz' target='_blank'>
                <GitHubIcon sx={{ fontSize: "28px" }} />
              </a>
            </Tooltip>
            &nbsp;
            &nbsp;
            &nbsp;
            <Tooltip title='LinkedIn' arrow>
              <a rel="noreferrer" href='https://www.linkedin.com/in/ali-ezzeddine-17b2b6248/' target='_blank'>
                <LinkedInIcon sx={{ fontSize: "28px" }} />
              </a>
            </Tooltip>
            &nbsp;
            &nbsp;
            &nbsp;
            <Tooltip title='Portfolio' arrow>
              <a rel="noreferrer" href='https://www.ali-ezzeddine.com' target='_blank'>
                <NewReleasesIcon sx={{ fontSize: "28px" }} />
              </a>
            </Tooltip>
          </div>
        </div>
      </Modal>
      <div className='abc'>
        <div className="full-page-container">
          <h1>Welcome to Bookle
            <Tooltip arrow title="More info">
              <InfoIcon onClick={handleModal} sx={{ cursor: "pointer" }} />
            </Tooltip>
          </h1>
          <h3>Created by <a rel="noreferrer" href='https://www.ali-ezzeddine.com' target='_blank'>Ali Ezzeddine</a></h3>
          <br />
          {lives > 0 && (
            <div className='guess-container'>
              <h2>Guess the book!</h2>
              <img alt="book cover" className={isCorrect ? "no-blur" : "blur"} src={data.Books[0].book_cover} />
              <div style={{ marginTop: "50px" }}>
                {[...Array(lives)].map((_, i) =>
                  <FavoriteIcon sx={{ color: "red" }} />
                )}
                {screenShake && (
                  <span className='falling-number'>-1</span>
                )}
              </div>
              <>
                <span>Title: {data.Books[0].title.split(" ").length} words</span>
                <span>Average Rating:</span>
                <Rating precision={0.1} value={Number(data.Books[0].avg_rating)} readOnly />
              </>
              <input onChange={(e) => setUserGuess(e.target.value)} placeholder='Guess a book' className='guess-input' />
              <button onClick={handleSubmit}>Submit</button>
              <div className='hint-container'>
                {showHint >= 1 && (
                  <div className='hint'>
                    Hint: {data.Books[0].hint_1}
                  </div>
                )}
                {showHint >= 2 && (
                  <div className='hint'>
                    Hint: {data.Books[0].hint_2}. It was released in {data.Books[0].release_year}
                  </div>
                )}
                {showHint >= 3 && (
                  <div className='hint'>
                    Hint: {data.Books[0].hint_3}
                  </div>
                )}
                {showHint >= 4 && (
                  <div className='hint'>
                    Hint: It was written by {data.Books[0].author}
                  </div>
                )}
              </div>
            </div>
          )}
          {lives === 0 && (
            <div className='guess-container'>
              <h2>Too bad! You didn't get the book right!</h2>
              <h2>The correct answer was <span style={{ color: "red" }}>{data.Books[0].title}</span> by {data.Books[0].author}</h2>
              <img alt="book cover" className={"no-blur"} src={data.Books[0].book_cover} />
              <>
                <p style={{ width: "50%" }}>{data.Books[0].description}</p>
                <span>Average Rating:</span>
                <Rating precision={0.1} value={Number(data.Books[0].avg_rating)} readOnly />
              </>
              <div className='hint-container'>
                {showHint >= 1 && (
                  <div className='game-over-hint'>
                    Hint: {data.Books[0].hint_1}
                  </div>
                )}
                {showHint >= 2 && (
                  <div className='game-over-hint'>
                    Hint: {data.Books[0].hint_2}. It was released in {data.Books[0].release_year}
                  </div>
                )}
                {showHint >= 3 && (
                  <div className='game-over-hint'>
                    Hint: {data.Books[0].hint_3}
                  </div>
                )}
                {showHint >= 4 && (
                  <div className='game-over-hint'>
                    Hint: It was written by {data.Books[0].author}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default App;
