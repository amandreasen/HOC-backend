const {pool} = require('../db/pool')

var express = require('express');
var router = express.Router();

router.get('/', (req, res) => {
    query = 'SELECT * FROM groups;'
    pool.query(query, (e, result) => {
        if(e){
            return res.status(400).send(e)
        }
        res.send(result.rows)
    })
});

router.get('/:id', (req, res) => {
    query = `SELECT * FROM groups WHERE group_id=${req.params.id}`;
    pool.query(query, (e, result) => {
        if(e){
            return res.status(400).send(e)
        } else if (res.length === 0){
            return res.status(404).send('Group not found!')
        }
        res.send(result.rows)
    })
})

module.exports = router