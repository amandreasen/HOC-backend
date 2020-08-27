const {pool} = require('../db/pool')

var express = require('express');
var router = express.Router();

router.get('/', (req, res) => {
    pool.query('SELECT * FROM users', (e, result) => {
        if(e){
            return res.status(e.detail)
        }
        res.send(result.rows)
    })
});

router.get('/:id', (req, res) => {
    query = `SELECT * FROM users WHERE user_id=${req.params.id};`
    pool.query(query, (e, result) => {
        if(e){
            return res.status(400).send(e)
        }
        res.send(result.rows)
    })
});

router.post('/', (req, res) => {
    try{
        params = Object.values(req.body)
        query = 'INSERT INTO users(name, netid, email, timezone) VALUES($1,$2,$3,$4);'
        pool.query(query, params, (e, result) => {
            if(e){
                return res.status(400).send(e.detail)
            }
            res.status(201).send()
        });
    }catch(e){
        res.status(400).send(e)
    }
    
});

router.delete('/:id', (req, res) => {
    query = `DELETE FROM users WHERE user_id=${req.params.id};`
    pool.query(query, (e, result) => {
        if(e){
            return res.status(400).send(e)
        }
        res.send()
    })
});




module.exports = router