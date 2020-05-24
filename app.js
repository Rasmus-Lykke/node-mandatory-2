const express = require("express");
const app = express();

// parse application/json
app.use(express.json());

var bodyParser = require('body-parser')
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())

const fs = require("fs");

const session = require('express-session');

const jwt = require('jsonwebtoken');


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
const { Model } = require('objection');
const Knex = require('knex');
const knexfile = require('./knexfile.js');

const knex = Knex(knexfile.development);

Model.knex(knex);

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

// Reads the HTML files into variables so its possible to combine them as you want.
// This way you do not need to have duplication HTML code.
const navbarPage = fs.readFileSync("./public/navbar/navbar.html", "utf8");
const footerPage = fs.readFileSync("./public/footer/footer.html", "utf8");

const frontpagePage = fs.readFileSync("./public/frontpage/frontpage.html", "utf8");
const playerPage = fs.readFileSync("./public/player/player.html", "utf8");
const uploadPage = fs.readFileSync("./public/upload/upload.html", "utf8");
const signinPage = fs.readFileSync("./public/signin/signin.html", "utf8");
const signupPage = fs.readFileSync("./public/signup/signup.html", "utf8");

// Check the token included in the request header for authorization of access to the pages. 
const checkToken = (req, res, next) => {

    var token = req.headers['x-access-token'] || req.headers['authorization'] || req.query.authorization; // Express headers are auto converted to lowercase

    console.log(req.headers)

    if (token) {
        
        // Some tokens have the convention of starting with the symbols "Bearer " which we are slicing. 
        if (token.startsWith('Bearer ')) {
            // Remove Bearer from string
            token = token.slice(7, token.length);
        }

        // Verifying the token with the "sessionsecret" saved in the config.json file.
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

app.get("/", (req, res) => {
    // console.log(req.headers)
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

// For testing purposes, require an access token in the header to access
app.get("/test", checkToken, (req, res) => {
    console.log(req.query.id);
    return res.send({response: "Success"})
})


// Setting up the server with port number
const port = process.env.PORT ? process.env.PORT : 3000;
const server = app.listen(port, (error) => {

    if (error) {
        console.log("Error starting the server");
    }
    console.log("This server is running on port", server.address().port);

    videosRoute.readFromFile();

});