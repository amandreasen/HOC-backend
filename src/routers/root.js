var express = require('express');
var router = express.Router();

router.get('/', (req, res) => {
    res.send('Welcome to the Hack Our Campus Study Groups Backend!')
})

module.exports = router