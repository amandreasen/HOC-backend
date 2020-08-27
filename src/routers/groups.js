const {pool} = require('../db/pool')

var express = require('express');
var router = express.Router();

//get all groups
router.get('/', (req, res) => {
    query = 'SELECT * FROM groups;'
    pool.query(query, (e, result) => {
        if(e){
            return res.status(400).send(e)
        } 

        data = result.rows

        if (data.length === 0){
            return res.status(404).send('No groups found!')
        }

        res.send(result.rows)
    })
});

//get group by group_id
router.get('/:id', (req, res) => {
    query = `SELECT * FROM groups WHERE group_id=${req.params.id}`;
    pool.query(query, (e, result) => {
        
        if(e){
            return res.status(400).send(e)
        }
        
        data = result.rows
        if (data.length === 0){
            return res.status(404).send('Group not found!')
        }

        res.send(data)
    })
})

//create new group
router.post('/', (req, res) => {
    params = Object.values(req.body);
    query = 'INSERT INTO groups(name,description,public,open) VALUES ($1,$2,$3,$4);'
    pool.query(query, params, (e, result) => {
        if(e){
            return res.status(400).send(e)
        }
        res.status(201).send('Group created successfully!')
    })
});

//delete group by group_id
router.delete('/:id', (req, res) => {
    query = `DELETE FROM groups WHERE group_id=${req.params.id};`
    pool.query(query, (e, result) => {
        if(e){
            return res.status(400).send(e)
        }

        if(result.rowCount === 0){
            return res.status(404).send('Group not found!')
        }

        res.send('Group deleted successfully!')
    })
});

module.exports = router