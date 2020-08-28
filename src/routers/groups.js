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
});

//create new group
router.post('/', async (req, res) => {
    const params = Object.values(req.body);
    const full_text = params[0] + ' ' + params[1];
    params.push(full_text)

    const query = `INSERT INTO 
    groups(group_name,description,class_code,meeting_format,days,public,owner,text_vector) 
    VALUES ($1,$2,$3,$4,$5,$6,$7,to_tsvector($8));`

    await pool.query(query, params)
        .then(result => res.status(201).send('Group created successfully!'))
        .catch(e => res.status(400).send(e))
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
    const query = `UPDATE groups SET group_name=$1, description=$2, meeting_format=$3, time=$4, days=$5, class_code=$string
     WHERE group_id=${req.params.id};`
    pool.query(query,params, (e, result) => {
        if(e){
            return res.status(400).send(e)
        }

        res.send('Group information updated successfully!')
    })
});

//add tags to group (tags is an array of tag_ids)
router.post('/:id/tags', async (req, res) => {
    const tags = req.body.tags
    const query = 'INSERT INTO join_groups_tags(group_id, tag_id) VALUES ($1,$2);'

    for(var i=0; i <tags.length; i++){
        await pool.query(query,[req.params.id,tags[i]])
            .then()
            .catch(e => {
                if (e.code === "23503"){
                    return res.status(404).send('Group or tag does not exist.');
                }
                return res.status(400).send(e);
            })
    }

    res.send('Tags updated successfully!');
});

//add user to group
router.post('/:id/users', async (req, res) => {
    const user = req.body.user_id
    const query = 'INSERT INTO join_users_groups(user_id, group_id) VALUES ($1,$2);'

    await pool.query(query, [user, req.params.id])
        .then(result => res.send('Joined group successfully!'))
        .catch(e => {
            if(e.code === "23503"){
                return res.status(404).send('Group or user does not exist.');
        }
        return res.status(400).send(e);
    });
});

//get member users in a group
router.get('/:id/users', async (req, res) => {
    query = `SELECT u.name, u.netid, u.email, u.timezone
    FROM users u, join_users_groups j
    WHERE j.group_id=${req.params.id} AND j.user_id=u.user_id;`

    await pool.query(query)
        .then(result => res.send(result.rows))
        .catch(e => res.status(400).send(e))
});

module.exports = router;