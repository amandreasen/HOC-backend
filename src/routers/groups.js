const {pool} = require('../db/pool')

var express = require('express');
var router = express.Router();

router.get('/', (req, res) => {
    query = 'SELECT * FROM groups;'
    pool.query(query, (e, result) => {
        data = result.rows
        if(e){
            return res.status(400).send(e)
        } else if (data.length === 0){
            return res.status(404).send('No groups found!')
        }
        res.send(result.rows)
    })
});

router.get('/:id', (req, res) => {
    query = `SELECT * FROM groups WHERE group_id=${req.params.id}`;
    pool.query(query, (e, result) => {
        data = result.rows
        if(e){
            return res.status(400).send(e)
        } else if (data.length === 0){
            return res.status(404).send('Group not found!')
        }
        res.send(data)
    })
})

router.post('/', (req, res) => {
    params = Object.values(req.body);
    query = 'INSERT INTO groups(name,description,public,open) VALUES ($1,$2,$3,$4);'
    pool.query(query, params, (e, result) => {
        if(e){
            return res.status(400).send(e)
        }
        res.status(201).send()
    })
});

router.delete('/:id', (req, res) => {
    query = `DELETE FROM groups WHERE group_id=${req.params.id};`
    pool.query(query, (e, result) => {
        if(e){
            return res.status(400).send(e)
        }
        res.send()
    })
});

module.exports = router