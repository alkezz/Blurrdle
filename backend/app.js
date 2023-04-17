const AWS = require('aws-sdk');
require('dotenv').config();
const cron = require('node-cron');
const socketIO = require('socket.io');
const express = require('express');
const http = require('http');
const WebSocket = require('ws');
const app = express();
const PORT = 8000; // or any port number you prefer
function shuffleArrayInPlace(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        const temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
}
// const configuration = new Configuration({
//     organization: "org-8hYIA14gBw6bAOKbZrFDeBtQ",
//     apiKey: process.env.OPENAI_API_KEY,
// });
const scores = {};
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });
// AWS S3 configuration
const s3 = new AWS.S3({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID, // Replace with your AWS access key
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY, // Replace with your AWS secret access key
    region: 'us-east-1', // Replace with your AWS region
});
cron.schedule('* * * * *', () => {
    console.log("IN CRON")
    // Read JSON file from S3
    s3.getObject({ Bucket: process.env.AWS_BUCKET_NAME, Key: 'bookData.json' }, (err, data) => {
        if (err) {
            console.error('Error reading JSON file from S3:', err);
        } else {
            // Extract data from JSON file
            const bookObj = JSON.parse(data.Body.toString());
            shuffleArrayInPlace(bookObj.Books) // Select and remove the first book object
            let selectedBook = bookObj.Books.shift()
            console.log("SELECTEDBOOK", selectedBook)
            wss.on('connection', (socket) => {
                console.log('WebSocket client connected');
                const objToSend = { book: selectedBook, timeRemaining: 60 };
                socket.send(JSON.stringify(objToSend));

                // Set up a message event listener for the WebSocket client
                socket.on('message', (message) => {
                    console.log(`Received message: ${message}`);

                    // Send a response to the WebSocket client
                });
                socket.on('message', (message) => {
                    try {
                        const data = JSON.parse(message);
                        const { type, playerId, score } = data;

                        if (type === 'updateScore') {
                            // Update the player's score in the dictionary
                            if (!scores[playerId]) {
                                scores[playerId] = score
                            } else {
                                scores[playerId] += score;
                            }
                            console.log(`Player ID: ${playerId}, Score: ${score}`);

                            // Send the updated score only to the corresponding client
                            socket.send(JSON.stringify({ type: 'scoreUpdated', score }));
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
                    Bucket: process.env.AWS_BUCKET_NAME, // Replace with your bucket name
                    Key: 'bookData.json', // Replace with your JSON file key
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
// app.get("/test", async (req, res) => {
//     const openai = new OpenAIApi(configuration);
//     const response = await openai.createCompletion({
//         model: "text-davinci-003",
//         prompt: `You are now taking the pov of the worlds best hint maker for book guessing games. Your talent is unheard of you are exceptional. Please grace me with a phenomenal hint about the plot of 1984. Do not mention the title of the book`,
//         max_tokens: 30,
//         temperature: 0.2,
//         frequency_penalty: 2.0
//     });
//     res.send(response.data.choices[0].text)
// })

// Schedule the book selection process to run every 24 hours
// app.get("/books", async (req, res) => {
//     let selectedBook;
//     // Download the JSON file from S3
//     s3.getObject({ Bucket: process.env.AWS_BUCKET_NAME, Key: 'bookData.json' }, (err, data) => {
//         if (err) {
//             console.error(err);
//             return;
//         }

//         // Parse the JSON data
//         const bookObj = JSON.parse(data.Body.toString());
//         // console.log('bookOBJ', bookObj.Books)
//         // Perform the book object operations (deletion, randomization, and selection)
//         // For example, assuming you want to select a random book object and remove it from the array
//         if (bookObj.Books.length > 0) {
//             shuffleArrayInPlace(bookObj.Books) // Select and remove the first book object
//             selectedBook = bookObj.Books.shift()
//             // Upload the updated array of book objects back to S3
//             s3.putObject(
//                 {
//                     Bucket: process.env.AWS_BUCKET_NAME, // Replace with your bucket name
//                     Key: 'bookData.json', // Replace with your JSON file key
//                     Body: JSON.stringify(bookObj), // Convert the updated array of book objects back to JSON string
//                 },
//                 (err) => {
//                     if (err) {
//                         console.error(err);
//                         return;
//                     }
//                 }
//             );

//         } else {
//             console.log('No books found');
//         }
//     });
//     const completionsParams = {
//         prompt: `Give me a json obj in the format of "title", "author", "release_year", "avg_rating", "description", "hint_1", "hint_2", and "hint_3" using the provided book The Great Gatsby`,
//         max_tokens: 75, // Adjust as needed
//     };
//     const completionsResponse = await openai.Completions.create(completionsParams);
//     const generatedText = completionsResponse.choices[0].text;
//     res.json({ generatedText })

// })
server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
