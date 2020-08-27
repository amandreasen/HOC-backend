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
    const query = `SELECT * FROM groups WHERE group_id=${req.params.id}`;
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
    const params = Object.values(req.body);
    const query = 'INSERT INTO groups(name,description,public,open,owner) VALUES ($1,$2,$3,$4,$5);'
    pool.query(query, params, (e, result) => {

        if(e){
            return res.status(400).send(e)
        }

        res.status(201).send('Group created successfully!')
    })
});

//delete group by group_id
router.delete('/:id', (req, res) => {
    const query = `DELETE FROM groups WHERE group_id=${req.params.id};`
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

//update group information by group_id
router.patch('/:id', (req, res) => {
    const params = Object.values(req.body);
    const query = `UPDATE groups SET name=$1, description=$2, public=$3, open=$4 WHERE group_id=${req.params.id};`
    pool.query(query,params, (e, result) => {
        if(e){
            return res.status(400).send(e)
        }

        res.send('Group information updated successfully!')
    })
});

//add tags to group (tags is an array of tag_ids)
router.post('/:id', async (req, res) => {
    const tags = req.body.tags
    const query = 'INSERT INTO join_groups_tags(group_id, tag_id) VALUES ($1,$2);'

    for(var i=0; i <tags.length; i++){
        await pool.query(query,[req.params.id,tags[i]])
            .then()
            .catch(e => res.status(400).send(e))
    }

    res.send('Tags updated successfully!');
});

module.exports = router