# Bookle

### Bookle is a mash up between the beloved game "Wordle" and all the other "dle" games like [Global](https://globle-game.com/), [Tradle](https://oec.world/en/tradle/), and [Gamedle](https://www.gamedle.wtf/#). 

#### The primary objective of this game is to guess the book right in 5 attempts. After each wrong guess a hint will appear to help guide you towards the right answer. After 24 hours a new book is chosen from a JSON file pulled from my S3 bucket and sent to the front end using WebSockets

Built using JavaScript, TypeScript, React, and WebSockets in the front end. In the back end to schedule a new book being chosen every 24 hours I used the cron package to pull data every time it fires, sends it to the front end to update the book, and removes that book from the JSON file to send back to my S3 bucket. I used a combination of Node.js, Express, and WebSockets to achieve the desired result

## Features
  * Currently, Bookle uses localStorage to track and manage user activity, including tracking if users have already played today's Bookle and their guesses for improved user experience.
  * After a win or loss, WebSockets will send your player_id, your score, and your time to the back end. The back end then will check whether your score is larger than the score saved and will replace it if it does and will do the same thing with the time it took you to finish.

## Limitations
  * Due to the small playerbase I decided to use WebSockets to more efficiently handle data but that comes at a caveat where the larger my playerbase grows the longer it will take to query my back end. In the future, I will rework my back end to create a database using PostgreSQL or a cloud based DynamoDB using AWS.
  * Also due to my small playerbase localStorage seemed like a good option to track players who enter my application. The first time a player enters they are given a player_id using uuid. After you win or lose, localStorage will update to include 2 Key Value Pairs, `"hasWon"` which will hold either `true` or `false` and `"guesses"` which holds the amount of attempts it took you to guess the book correctly. The limitation comes from users being able to clear their localStorage which would lose all the progress they've made and can lead to "cheating". As my playerbase grows I will move away from localStorage and again use a database to track users more efficiently and securely.
  
## Installation
To install Bookle to your local machine follow these steps:
 * Using your favorite terminal, change directory to where you want to save Bookle
 * Next if using SSH clone the project using `git clone git@github.com:alkezz/Bookle.git`
   * HTTPS: `git clone https://github.com/alkezz/Bookle.git`
 * Once you've cloned Bookle and you have verified it is on your machine:
   * Change directory to the backend `cd backend` and install the necessary dependencies `npm install`
   * Again change directory but now to the frontend folder `cd ..` `cd frontend` and install the necessary dependencies `npm install`
 * Using the `.env.example` input your keys to allow the application to work in the backend and rename the file to `.env`
   * HEADS UP: Keep in mind since I am pulling a JSON file from my S3 bucket to get book data you will not have any data to play with since that would require my AWS Secret Key but on request I will send you the book data to play around with if that is something you would like.
   * If you decide to create your own data to play around with be sure to follow the format of: 
   ```json
   {
   "title", 
   "author", 
   "release_year", 
   "book_cover", 
   "blurred_cover", 
   "avg_rating", 
   "description", 
   "hint_1", 
   "hint_2", 
   "hint_3"
   }
   ```
   title, author, release_year, avg_rating, description, hint_1, hint_2, and hint_3 are self explanatory but book_cover is a url to a picture of the book and blurred_cover is the same picture but blurred 
      * *I am using an S3 bucket to hold onto these pictures to limit cheating*
   * This is assuming that you have an S3 bucket you can work with
     * If you don't, you can add a JSON file in the `frontend/src` directory and use that raw data to display books in the front end. Be sure to follow the format above
 * Once all that is out of the way, change directory to the backend `cd backend` and type into the terminal `npm start`.
   * Use `npm run dev` if you want to start the app using nodemon
 * Open a new terminal, change directory to the frontend `cd frontend` and type into the terminal once again `npm start`
 * If you did everything correctly, your default browser will open a new tab to the React App
 * Have fun :)
 
 ## Upcoming Features
In the future, I plan on implementing GPT3 to make my life a bit easier when it comes to creating objects for each book. In a perfect world, I would pass in a book title to GPT3 in my backend and a prompt to create a JSON object. The response will be a book object with the key value pairs mentioned above that I can then send to my frontend.
As mentioned in my "Limitations" a database will be implemented in the near future to secure data from both bad actors and loss.

## Example Code
 * app.js
 * In the code block below I am setting up a cron schedule (right now it's every minute for testing purposes) to read a file taken from my S3 bucket. Once we read and parse the JSON file we shuffle the array using `shuffleArrayInPlace(bookObj.Books)`
 ```
 function shuffleArrayInPlace(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        const temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
}
```
We then select the first book from the randomized array by using `Array.shift()` which will extract the book data as well as removing it from my JSON file that I send back
The WebSocket then connects to my application and sends the selected book and time remaining to my front end React App.
`const objToSend = { book: selectedBook, timeRemaining: 60 };` `socket.send(JSON.stringify(objToSend));`

I have logic to also send data from my frontend to my backend once a game is complete, which is the `player_id`, their score, and their time.

If they don't exist in my backend dictionary:
```
if (!scores[playerId]) {
   scores[playerId] = {
    bestGuess: attempts,
    best_time: time,
    firstTry: 0
  }
}                         
```
We set a key value pair of the player_id in scores and that player_id object stores info about that player

If they already exist we then just update their reference object to the new values IF they satisfy the conditions

```
else {
  scores[playerId] = {
    bestGuess: attempts > 0 && attempts > this.bestGuess ? attempts : this.bestGuess,
    best_time: best_time > this.best_time ? best_time : this.best_time,
    firstTry: firstTry ? this.firstTry++ : this.firstTry
  }
}
```
We then send our new JSON file with the selected book removed back to my S3 bucket to redo the process the next day!

```
s3.putObject(
 {
   Bucket: process.env.AWS_BUCKET_NAME,
   Key: 'bookData.json',
   Body: JSON.stringify(bookObj), // Convert the updated array of book objects back to JSON string
 },
 (err) => {
   if (err) {
    console.error(err);
    return;
  }
 }
);
```

## Full Backend Cron Schedule Code

```
cron.schedule('* * * * *', () => {
    // Read JSON file from S3
    s3.getObject({ Bucket: process.env.AWS_BUCKET_NAME, Key: 'bookData.json' }, (err, data) => {
        if (err) {
            console.error('Error reading JSON file from S3:', err);
        } else {
            // Extract data from JSON file
            const bookObj = JSON.parse(data.Body.toString());
            shuffleArrayInPlace(bookObj.Books) // Randomize the book array
            let selectedBook = bookObj.Books.shift() // Select and remove the first book object
            wss.on('connection', (socket) => { // Connecting to WebSocket
                console.log('WebSocket client connected');
                // Creating an obj to send consisting of the book and time remaining before the next book
                const objToSend = { book: selectedBook, timeRemaining: 60 };
                // Sending the book selected from above to send to the front end
                socket.send(JSON.stringify(objToSend));

                // Set up a message event listener for the WebSocket client
                socket.on('message', (message) => {
                    try {
                        const data = JSON.parse(message);
                        const { type, playerId, attempts, time, firstTry } = data;

                        if (type === 'updateScore') {
                            // Update the player's score in the dictionary
                            if (!scores[playerId]) {
                                scores[playerId] = {
                                    bestGuess: attempts,
                                    best_time: time,
                                    firstTry: 0
                                }
                            } else {
                                scores[playerId] = {
                                    bestGuess: attempts > 0 && attempts > this.bestGuess ? attempts : this.bestGuess,
                                    best_time: best_time > this.best_time ? best_time : this.best_time,
                                    firstTry: firstTry ? this.firstTry++ : this.firstTry
                                }
                            }

                            // Send the updated score only to the corresponding client
                            socket.send(JSON.stringify({ type: 'score', scores: scores[playerId] }));
                        }

                    } catch (error) {
                        console.error('Error parsing message:', error);
                    }
                })
                // Set up a close event listener for the WebSocket client
                socket.on('close', () => {
                    console.log('WebSocket client disconnected');
                });
            });
            s3.putObject(
                {
                    Bucket: process.env.AWS_BUCKET_NAME,
                    Key: 'bookData.json',
                    Body: JSON.stringify(bookObj), // Convert the updated array of book objects back to JSON string
                },
                (err) => {
                    if (err) {
                        console.error(err);
                        return;
                    }
                }
            );
        }
    });
});
```
## Contact Me
If there's anything you think might be beneficial to add to the application or a glaring bug please don't be afraid to contact me!
