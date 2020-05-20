const express = require("express");
const fs = require("fs");

const app = express();

const session = require('express-session');

const jwt = require('jsonwebtoken');

// parse application/json
app.use(express.json());

// You need to copy the config.template.json file and fill out your own secret
const config = require('./config/config.json');

// Middleware, sits between the request and the response
app.use(session({
    secret: config.sessionSecret,
    resave: false,
    saveUninitialized: true
}));

// Setup rateLimit
const rateLimit = require('express-rate-limit');

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100 // limit each IP to 100 requests per windowMs
});

const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 15 // limit each IP to 15 requests per windowMs
});

app.use(limiter);

app.use('/signup', authLimiter);
app.use('/signin', authLimiter);

/* Setup Knex with Objection */
const {
    Model
} = require('objection');
const Knex = require('knex');
const knexfile = require('./knexfile.js');

const knex = Knex(knexfile.development);

Model.knex(knex);

// parse application/x-www-form-urlencoded
app.use(express.urlencoded({
    extended: false
}));

app.use(express.static('public'));
app.use(express.static('pictures'));


// Import routes
const authRoute = require('./routes/auth.js');
const usersRoute = require('./routes/users.js');
const videosRoute = require("./routes/pictures");
// Set up routes with our server
app.use(videosRoute.router);
app.use(authRoute);
app.use(usersRoute);


const navbarPage = fs.readFileSync("./public/navbar/navbar.html", "utf8");
const footerPage = fs.readFileSync("./public/footer/footer.html", "utf8");

const frontpagePage = fs.readFileSync("./public/frontpage/frontpage.html", "utf8");
const playerPage = fs.readFileSync("./public/player/player.html", "utf8");
const uploadPage = fs.readFileSync("./public/upload/upload.html", "utf8");
const signinPage = fs.readFileSync("./public/signin/signin.html", "utf8");
const signupPage = fs.readFileSync("./public/signup/signup.html", "utf8");

let checkToken = (req, res, next) => {
    let token = req.headers['x-access-token'] || req.headers['authorization']; // Express headers are auto converted to lowercase

    if (token) {
        jwt.verify(token, config.sessionSecret, (err, decoded) => {
            if (err) {
                return res.json({
                    success: false,
                    message: 'Token is not valid'
                });
            } else {
                req.decoded = decoded;
                console.log("Success!")
                next();
            }
        });

    } else {
        return res.json({
            success: false,
            message: 'Auth token is not supplied'
        });
    }
};

app.get("/", checkToken, (req, res) => {
    videosRoute.readFromFile();
    return res.send(navbarPage + frontpagePage + footerPage);
});

app.get("/player/:videoId", checkToken, (req, res) => {
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

const port = process.env.PORT ? process.env.PORT : 3000;

const server = app.listen(port, (error) => {

    if (error) {
        console.log("Error starting the server");
    }
    console.log("This server is running on port", server.address().port);

    videosRoute.readFromFile();

});