# Bookle

### Bookle is a mash up between the beloved game "Wordle" and all the other "dle" games like [Global](https://globle-game.com/), [Tradle](https://oec.world/en/tradle/), and [Gamdle](https://www.gamedle.wtf/#). 

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
   * If you decide to create your own data to play around with be sure to follow the format of: `{"title", "author", "release_year", "book_cover", "blurred_cover", "avg_rating", "description", "hint_1", "hint_2", "hint_3"}` title, author, release_year, avg_rating, description, hint_1, hint_2, and hint_3 are self explanitory but book_cover is a url to a picture of the book and blurred_cover is the same picture but blurred 
      * *I am using an S3 bucket to hold onto these pictures to limit cheating*
   *
   
