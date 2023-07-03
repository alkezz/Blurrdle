const AWS = require('aws-sdk');
require('dotenv').config();
const cron = require('node-cron');
const express = require('express');
const http = require('http');
const WebSocket = require('ws');
const app = express();
const CronJob = require("cron").CronJob;
const PORT = 8000;
function shuffleArrayInPlace(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        const temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
}
function timeLeftForCronJob() {
    const currentTime = new Date();
    const nextRunTime = new Date(currentTime.getTime() + 5 * 60 * 1000);
    const timeLeftInSeconds = Math.floor((nextRunTime - currentTime) / 1000);
    return timeLeftInSeconds;
}
// AWS S3 configuration
const s3 = new AWS.S3({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: 'us-east-1'
});
const scores = {};
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });
console.log("NOT IN CRON OUTSIDE FIRST FN")
s3.getObject({ Bucket: process.env.AWS_BUCKET_NAME, Key: 'bookData.json' }, (err, data) => {
    if (err) {
        console.error('Error reading JSON file from S3:', err);
    } else {
        console.log("IN FN")
        // Extract data from JSON file
        const bookObj = JSON.parse(data.Body.toString());
        shuffleArrayInPlace(bookObj.Books) // Randomize the book array
        let selectedBook = bookObj.Books.shift() // Select and remove the first book object
        wss.on('connection', (socket) => { // Connecting to WebSocket
            console.log('WebSocket client connected');
            // Creating an obj to send consisting of the book and time remaining before the next book
            const nextUpdateTime = new Date(cronJob.nextDates())
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
wss.on('connection', (socket) => {
    socket.on('message', (message) => {
        try {
            const data = JSON.parse(message);
            const { type, playerId, attempts, time, firstTry } = data;

            if (type === 'updateScore') {
                // Update the player's score in the dictionary
                if (!scores[playerId]) {
                    scores[playerId] = {
                        bestGuess: attempts,
                        bestTime: time,
                        firstTry: 0
                    }
                } else {
                    scores[playerId] = {
                        bestGuess: attempts > 0 && attempts > this.bestGuess ? attempts : this.bestGuess,
                        bestTime: best_time > this.best_time ? best_time : this.best_time,
                        firstTry: firstTry ? this.firstTry++ : this.firstTry
                    }
                }

                // Send the updated score only to the corresponding client
                socket.send(JSON.stringify({ type: 'score', scores: scores[playerId] }));
                console.log(scores[playerId], "SCORES")
            }

        } catch (error) {
            console.error('Error parsing message:', error);
        }
    })
})
const cronJob = new CronJob('0 0 * * *', () => {
    console.log("IN CRON")
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
setInterval(() => {
    console.log("Next job time:", new Date(cronJob.nextDates()))
}, 30000);
server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

// DateTime {
//     ts: 1682360400000,
//     _zone: SystemZone {},
//     loc: Locale {
//       locale: 'en-US',
//       numberingSystem: null,
//       outputCalendar: null,
//       intl: 'en-US',
//       weekdaysCache: { format: {}, standalone: {} },
//       monthsCache: { format: {}, standalone: {} },
//       meridiemCache: null,
//       eraCache: {},
//       specifiedLocale: null,
//       fastNumbersCached: null
//     },
//     invalid: null,
//     weekData: {
//       weekYear: 2023,
//       weekNumber: 17,
//       weekday: 1,
//       hour: 14,
//       minute: 20,
//       second: 0,
//       millisecond: 0
//     },
//     c: {
//       year: 2023,
//       month: 4,
//       day: 24,
//       hour: 14,
//       minute: 20,
//       second: 0,
//       millisecond: 0
//     },
//     o: -240,
//     isLuxonDateTime: true
//   }
