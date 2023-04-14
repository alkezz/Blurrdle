const express = require('express');
const fs = require('fs');
const AWS = require('aws-sdk');
require('dotenv').config();
import { Configuration, OpenAIApi } from "openai";
const app = express();
const PORT = 5000; // or any port number you prefer
function shuffleArrayInPlace(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        const temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
}
const configuration = new Configuration({
    organization: "org-8hYIA14gBw6bAOKbZrFDeBtQ",
    apiKey: process.env.OPENAI_API_KEY,
});
// AWS S3 configuration
const s3 = new AWS.S3({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID, // Replace with your AWS access key
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY, // Replace with your AWS secret access key
    region: 'us-east-1', // Replace with your AWS region
});

app.get("/test", async (req, res) => {
    const openai = new OpenAIApi(configuration);
    const response = await openai.listEngines();
})

// Schedule the book selection process to run every 24 hours
app.get("/books", async (req, res) => {
    let selectedBook;
    // Download the JSON file from S3
    s3.getObject({ Bucket: process.env.AWS_BUCKET_NAME, Key: 'bookData.json' }, (err, data) => {
        if (err) {
            console.error(err);
            return;
        }

        // Parse the JSON data
        const bookObj = JSON.parse(data.Body.toString());
        // console.log('bookOBJ', bookObj.Books)
        // Perform the book object operations (deletion, randomization, and selection)
        // For example, assuming you want to select a random book object and remove it from the array
        if (bookObj.Books.length > 0) {
            shuffleArrayInPlace(bookObj.Books) // Select and remove the first book object
            selectedBook = bookObj.Books.shift()
            // Upload the updated array of book objects back to S3
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

        } else {
            console.log('No books found');
        }
    });
    const completionsParams = {
        prompt: `Give me a json obj in the format of "title", "author", "release_year", "avg_rating", "description", "hint_1", "hint_2", and "hint_3" using the provided book The Great Gatsby`,
        max_tokens: 75, // Adjust as needed
    };
    const completionsResponse = await openai.Completions.create(completionsParams);
    const generatedText = completionsResponse.choices[0].text;
    res.json({ generatedText })

})
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
