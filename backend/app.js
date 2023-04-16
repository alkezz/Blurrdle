const AWS = require('aws-sdk');
require('dotenv').config();
const cron = require('node-cron');
const socketIO = require('socket.io');
const express = require('express');
const http = require('http');
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
const server = http.createServer(app);
// AWS S3 configuration
const s3 = new AWS.S3({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID, // Replace with your AWS access key
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY, // Replace with your AWS secret access key
    region: 'us-east-1', // Replace with your AWS region
});
const io = socketIO(server, {
    cors: {
        origin: 'http://localhost:3000', // Replace with the URL of your frontend application
        methods: ['GET', 'POST'], // Allow specified HTTP methods
        allowedHeaders: ['Content-Type'], // Allow specified headers
        credentials: true
    }
});
io.on('connection', (socket) => {
    console.log('Client connected:', socket.id);
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
            // Emit event with extracted data and time remaining to WebSocket clients
            io.emit('dataReady', { book: selectedBook, timeRemaining: 60 });
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
