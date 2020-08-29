const {pool} = require('../db/pool')

var express = require('express');
var router = express.Router();

router.get('/', async (req, res) => {
    let term = req.query.term === undefined ? '' : req.query.term;
    term = term.split(' ').join('&');
    param = [term];

    const query = `SELECT * FROM groups WHERE text_vector @@ to_tsquery($1);`

    await pool.query(query,param)
        .then(result => res.send(result.rows))
        .catch(e => res.status(400).send(e))
});


module.exports = router
