const router = require('express').Router();

const User = require("../models/User.js");

const jwt = require('jsonwebtoken');
// You need to copy the config.template.json file and fill out your own secret
let config = require('../config/config.json');

const bcrypt = require('bcrypt');
const saltRounds = 12;


router.post('/signin', (req, res) => {

    console.log("Login started");
    console.log(req.body.email);

    const {
        email,
        password
    } = req.body;

    if (email.length > 0 && password.length > 0) {

        try {

            User.query().select('email', "password").where('email', email).then(foundUser => {

                if (foundUser.length < 1) {
                    return res.status(500).send({
                        response: "User does not exists"
                    });
                } else {
                    bcrypt.compare(password, foundUser[0].password).then(result => {
                        if (result == true) {
                            const accessToken = jwt.sign({username: foundUser[0].username}, config.sessionSecret);
                            console.log(accessToken);
                            res.json({
                                success: true,
                                message: 'Authentication successful!',
                                token: accessToken
                            });
                            return 

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

    if (username && password) {
        // password validation
        if (password.length < 8) {
            return res.status(400).send({
                response: "Password must be 8 characters or longer"
            });
        } else {
            // Username validation
            try {
                User.query().select('username').where('username', username).then(foundUsername => {
                    if (foundUsername.length > 0) {
                        return res.status(400).send({
                            response: "User already exists"
                        });
                    } else {
                        // Email validation
                        try {
                            User.query().select('email').where('email', email).then(foundUserEmail => {
                                if (foundUserEmail.length > 0) {
                                    return res.status(400).send({
                                        response: "Email already exists"
                                    });
                                } else {
                                    // Password encryption
                                    bcrypt.hash(password, saltRounds).then(hashedPassword => {
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