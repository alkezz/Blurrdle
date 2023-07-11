# Blurrdle

### Blurrdle is a mash-up between the beloved game "Wordle" and all the other "dle" games like [Global](https://globle-game.com/), [Tradle](https://oec.world/en/tradle/), and [Gamedle](https://www.gamedle.wtf/#).

#### The primary objective of this game is to guess the book right in 5 attempts. After each wrong guess a hint will help guide you towards the correct answer. After 24 hours a new book is chosen from a JSON file pulled from my S3 bucket and sent to the front end using WebSockets

Blurrdle is built using JavaScript, TypeScript, React, and WebSockets in the front end. In the back end, a scheduling mechanism is implemented using the cron package to select a new book every 24 hours. The application pulls data using the cron job, updates the book on the front end, and removes the selected book from the JSON file before sending it back to the S3 bucket. To achieve this functionality, a combination of Node.js and WebSockets is used.

## Features
Blurrdle utilizes `localStorage` to effectively track and manage user activity. The following variables are employed for this purpose:

- `Hint`: Keeps track of the hint number the user was on when they left or when the page was reloaded.
- `hasWon`: Indicates whether the user has played today's Blurrdle and whether they won or lost.
- `Lives`: Maintains the current session's count of the user's lives to ensure consistency upon page refresh.
- `Player_stats`: Tracks various player statistics, including perfect games, career guesses, guesses made today, and the total number of Blurrdles played.

By leveraging `localStorage`, Blurrdle ensures a seamless user experience by persistently storing and retrieving these essential data points. ![image](https://github.com/alkezz/Blurrdle/assets/105993056/e3f910de-a35e-4fb3-96aa-7739a5da35b8)

## Limitations
  * Due to my small player base localStorage seemed like a good option to track players who enter my application. The first time a player enters they are given a player_id using uuid. After you win or lose, localStorage will update to include 2 Key Value Pairs, `"hasWon"` which will hold either `true` or `false` and `"guesses"` which holds the amount of attempts it took you to guess the book correctly. The limitation comes from users being able to clear their localStorage which would lose all the progress they've made and can lead to "cheating".

## Installation
To install Blurrdle to your local machine follow these steps:
 * Using your favorite terminal, change directory to where you want to save Blurrdle
 * Next if using SSH clone the project using `git clone git@github.com:alkezz/Bookle.git`
   * HTTPS: `git clone https://github.com/alkezz/Bookle.git`
 * Once you've cloned Blurrdle and you have verified it is on your machine:
   * Change directory to the back end `cd backend` and install the necessary dependencies `npm install`
   * Again change directory but now to the front end folder `cd ..` `cd frontend` and install the necessary dependencies `npm install`
 * Using the `.env.example` input your keys to allow the application to work in the back end and rename the file to `.env`
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
 * Once all that is out of the way, change directory to the back end `cd backend` and type into the terminal `npm start`.
   * Use `npm run dev` if you want to start the app using nodemon
 * Open a new terminal, change directory to the front end `cd frontend` and type into the terminal once again `npm start`
 * If you did everything correctly, your default browser will open a new tab to the React App
 * Have fun :)

 ## Upcoming Features
In the future, I plan on implementing GPT3 to make my life a bit easier when it comes to creating objects for each book. In a perfect world, I would pass in a book title to GPT3 in my back end and a prompt to create a JSON object. The response will be a book object with the key value pairs mentioned above that I can then send to my front end.

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
<br/>
The WebSocket then connects to my application and sends the selected book and time remaining to my front end React App.
`const objToSend = { book: selectedBook, nextUpdateTime };` `socket.send(JSON.stringify(objToSend));`


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

## Full Back End Cron Schedule Code

```
const cronJob = new CronJob('0 0 * * *', () => {
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
                const nextUpdateTime = new Date(cronJob.nextDates())
                // Creating an obj to send consisting of the book and time remaining before the next book
                const objToSend = { book: selectedBook, nextUpdateTime };
                // Sending the book selected from above to send to the front end
                socket.send(JSON.stringify(objToSend));

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
}, null, true);
```
## Contact Me
If there's anything you think might be beneficial to add to the application or a glaring bug please don't be afraid to contact me!
