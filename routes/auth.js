const router = require('express').Router();

const User = require("../models/User.js");

// JSON Web Token for creating JSON tokens. This is a way to validate that the user as access to the pages.
const jwt = require('jsonwebtoken');
// You need to copy the config.template.json file and fill out your own secret
let config = require('../config/config.json');

// Using bcrypt for encrypting and decrypting the passwords
const bcrypt = require('bcrypt');
const saltRounds = 12;


router.post('/signin', (req, res) => {

    console.log(req.headers)

    console.log("Login started");
    console.log(req.body.email);

    const {
        email,
        password
    } = req.body;

    if (email.length > 0 && password.length > 0) {
        try {
            // Searching the database for a user with the email which was typed into the sign in form.
            User.query().select('email', "password").where('email', email).then(foundUser => {

                if (foundUser.length < 1) {
                    return res.status(500).send({
                        response: "User does not exists"
                    });
                } else {
                    // Decrypting the password found in the database and compares it with the password typed in into the form.
                    bcrypt.compare(password, foundUser[0].password).then(result => {
                        if (result == true) {
                            // Creating the access token and returning it to the client, who is supposed to use when accessing locked pages.
                            // This access token should be sent from the client to the server in the req.header. 
        
                            const accessToken = jwt.sign({username: foundUser[0].username}, config.sessionSecret);
                            // document.cookie = "auth="+accessToken;
                            res.json({
                                type: true,
                                data: foundUser[0].username,
                                token: accessToken // The token
                            });

                        } else {
                            return res.send({
                                response: "The password did not match"
                            });
                        }
                    });
                }
            });
            
        } catch (error) {
            return res.send({
                response: "Something went wrong with the DB"
            });
        }

    } else {

        return res.send({
            response: "You did not fulfill the requirements"
        });
    }
});


router.post('/signup', (req, res) => {
    const {
        username,
        password,
        email
    } = req.body;

    // Makes sure that none of the variables are empty
    if (username && password && username) {
        // password validation
        if (password.length < 8) {
            return res.status(400).send({
                response: "Password must be 8 characters or longer"
            });
        } else {
            // Username validation. We do not want anyone with the same username
            try {
                // Searches the database for an existing user with same username.
                User.query().select('username').where('username', username).then(foundUsername => {
                    if (foundUsername.length > 0) {
                        return res.status(400).send({
                            response: "User already exists"
                        });
                    } else {
                        // Email validation. We do not want anyone with the same username
                        try {
                            // Searches the database for an existing user with same username.
                            User.query().select('email').where('email', email).then(foundUserEmail => {
                                if (foundUserEmail.length > 0) {
                                    return res.status(400).send({
                                        response: "Email already exists"
                                    });
                                } else {
                                    // Password encryption
                                    bcrypt.hash(password, saltRounds).then(hashedPassword => {
                                        // Saves the new user in the database with the input and encrypted password
                                        User.query().insert({
                                            username,
                                            email,
                                            password: hashedPassword

                                        }).then(createdUser => {
                                            return res.send({
                                                response: `The user ${createdUser.username} was created`
                                            });
                                        });
                                    });
                                }

                            });
                        } catch {
                            return res.status(500).send({
                                response: "Something went wrong with the DB"
                            });
                        }
                    }

                });
            } catch (error) {
                return res.status(500).send({
                    response: "Something went wrong with the DB"
                });
            }
        }
    } else {
        return res.status(400).send({
            response: "username or password missing"
        });
    }
});

router.get('/logout', (req, res) => {
    return res.status(501).send({
        response: "Not implemented yet"
    });
});

module.exports = router;