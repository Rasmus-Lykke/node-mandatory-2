const router = require('express').Router();

const User = require("../models/User.js");


router.post('/login', (req, res) => {
    return res.status(501).send({
        response: "Not implemented yet"
    });
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
                                    User.query().insert({
                                        username,
                                        password,
                                        email
                                    }).then(createdUser => {
                                        return res.send({
                                            response: `The user ${createdUser.username} was created`
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