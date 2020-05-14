const express = require("express");
const fs = require("fs");

const app = express();

// parse application/json
app.use(express.json());

/* Setup Knex with Objection */

const { Model } = require('objection');
const Knex = require('knex');
const knexfile = require('./knexfile.js');

const knex = Knex(knexfile.development);

Model.knex(knex);


// parse application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: false }));
 
app.use(express.static('public'));
app.use(express.static('pictures'));

// Import routes
const authRoute = require('./routes/auth.js');
const usersRoute = require('./routes/users.js');
const videosRoute = require("./routes/pictures");


const navbarPage = fs.readFileSync("./public/navbar/navbar.html", "utf8");
const footerPage = fs.readFileSync("./public/footer/footer.html", "utf8");

const frontpagePage = fs.readFileSync("./public/frontpage/frontpage.html", "utf8");
const playerPage = fs.readFileSync("./public/player/player.html", "utf8");
const uploadPage = fs.readFileSync("./public/upload/upload.html", "utf8");
const signinPage = fs.readFileSync("./public/signin/signin.html", "utf8");
const signupPage = fs.readFileSync("./public/signup/signup.html", "utf8");

app.get("/", (req, res) => {
    videosRoute.readFromFile();
    return res.send(navbarPage + frontpagePage + footerPage);
});

app.get("/player/:videoId", (req, res) => {
    return res.send(navbarPage + playerPage + footerPage);
});

app.get("/upload", (req, res) => {
    return res.send(navbarPage + uploadPage + footerPage);
});

app.get("/signin", (req, res) => {
    return res.send(navbarPage + signinPage + footerPage);
});

app.get("/signup", (req, res) => {
    return res.send(navbarPage + signupPage + footerPage);
});

// Set up routes with our server
app.use(videosRoute.router);
app.use(authRoute);
app.use(usersRoute);

const port = process.env.PORT ? process.env.PORT : 3000;

const server = app.listen(port, (error) => {
    if (error) {
        console.log("Error starting the server");
    }
    console.log("This server is running on port", server.address().port);
 
    videosRoute.readFromFile();

});