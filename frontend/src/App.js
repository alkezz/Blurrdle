import { useState, useEffect } from 'react';
import './App.css';
import data from "./BookData/bookData.json"
import InfoIcon from '@mui/icons-material/Info';
import Rating from '@mui/material/Rating';
import Tooltip from '@mui/material/Tooltip';
import FavoriteIcon from '@mui/icons-material/Favorite';

function App() {
  const [isCorrect, setIsCorrect] = useState(false)
  const [userGuess, setUserGuess] = useState('')
  const [lives, setLives] = useState(5)
  const [screenShake, setScreenShake] = useState(false)
  // const [hintOne, setHintOne] = useState(false)
  // const [hintTwo, setHintTwo] = useState(false)
  // const [hintThree, setHintThree] = useState(false)
  // const [hintFour, setHintFour] = useState(false)
  // const [hintFive, setHintFive] = useState(false)
  const [showHint, setShowHint] = useState(0)
  const handleWin = () => {
    setIsCorrect(true)
  }
  const handleLoss = () => {

  }
  const handleSubmit = () => {
    if (userGuess.toLowerCase() === data.Books[0].title.toLowerCase()) {
      handleWin();
    } else {
      setLives(lives - 1)
      setShowHint(showHint + 1)
      setScreenShake(true)
      setTimeout(() => {
        setScreenShake(false)
      }, 500)
    }
  }
  useEffect(() => {
    if (lives === 0) {
      handleLoss();
    }
    if (screenShake) {
      document.body.className = "shake-screen"
    } else {
      document.body.className = ""
    }
  }, [lives, setLives, screenShake])
  return (
    <div className='abc'>
      <div className="full-page-container">
        <h1>Welcome to Bookle
          <Tooltip arrow title="More info">
            <InfoIcon sx={{ cursor: "pointer" }} />
          </Tooltip>
        </h1>
        <h3>Created by <a rel="noreferrer" href='https://www.ali-ezzeddine.com' target='_blank'>Ali Ezzeddine</a></h3>
        <br />
        {lives > 0 && (
          <div className='guess-container'>
            <h2>Guess the book!</h2>
            <img className={isCorrect ? "no-blur" : "blur"} src={data.Books[0].book_cover} />
            <div style={{ marginTop: "50px" }}>
              {[...Array(lives)].map((_, i) =>
                <FavoriteIcon sx={{ color: "red" }} />
              )}
              {screenShake && (
                <span className='falling-number'>-1</span>
              )}
            </div>
            <input onChange={(e) => setUserGuess(e.target.value)} placeholder='Guess a book' className='guess-input' />
            <>
              <span>Title: {data.Books[0].title.split(" ").length} words</span>
              <span>Average Rating:</span>
              <Rating precision={0.1} value={Number(data.Books[0].avg_rating)} readOnly />
            </>
            <button onClick={handleSubmit}>Submit</button>
            <div className='hint-container'>
              {showHint >= 1 && (
                <div className='hint'>
                  Hint 1: {data.Books[0].hint_1}
                </div>
              )}
              {showHint >= 2 && (
                <div className='hint'>
                  Hint 2: {data.Books[0].hint_2}. It was released in {data.Books[0].release_year}
                </div>
              )}
              {showHint >= 3 && (
                <div className='hint'>
                  Hint 3: {data.Books[0].hint_3}
                </div>
              )}
              {showHint >= 4 && (
                <div className='hint'>
                  Author: {data.Books[0].author}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
