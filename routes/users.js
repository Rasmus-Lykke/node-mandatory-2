const router = require('express').Router();

const User = require('../models/User.js');

// Async function
router.get('/users', async (req, res) => {
    const allUsers = await User.query().select('username');
    return res.send({ response: allUsers });
});


module.exports = router;