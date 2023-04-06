const https = require('https');
const express = require('express');
const db = require('./db');


const app = express();
let query = "1984"
const title = 'Crime and Punishment';
app.get("/data", async (req, res) => {
    const options = {
        hostname: 'openlibrary.org',
        path: `/search.json?title=${encodeURIComponent(title)}`,
        method: 'GET'
    };
    const request = https.request(options, wikiRes => {
        let data = '';
        wikiRes.on('data', chunk => {
            data += chunk;
        });
        wikiRes.on('end', () => {
            const result = JSON.parse(data);
            if (result.numFound > 0) {
                // Get the first book from the search results
                const book = result.docs[0];
                res.send(book)
            } else {
                console.log('No books found');
            }
        });
    });

    request.on('error', error => {
        console.error(error);
        res.status(500).send('An error occurred');
    });
    request.end();
})

app.get('/users', (req, res) => {
    db.query('SELECT * FROM users', (err, result) => {
        if (err) {
            console.error(err);
            res.status(500).send('Error fetching users');
        } else {
            res.json(result.rows);
        }
    });
});

app.listen(3000, () => {
    console.log('Server is running on port 3000');
});
