const {pool} = require('../db/pool')

var express = require('express');
var router = express.Router();


//search for groups with specified tag(provide tag_id); optionally provide limit parameter to limit results
router.get('/:id', (req, res) =>{
    query = `SELECT g.group_id, g.name, g.description, g.open, g.public
    FROM groups g, join_groups_tags j
    WHERE j.tag_id=${req.params.id} AND g.group_id=j.group_id`

    query = req.query.limit === undefined ? query + ';' : query + ` LIMIT ${req.query.limit};` 

    pool.query(query)
        .then(result => {
            data = result.rows 
            if (data.length === 0){
                return res.status(404).send('No groups found!')
            }
            res.send(data)
        })
        .catch(e => res.send(e))
})

module.exports = router
