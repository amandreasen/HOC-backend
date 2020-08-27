const {pool} = require('../db/pool')

var express = require('express');
var router = express.Router();


//search for groups with specified tag(provide tag_id); optionally provide limit parameter to limit results
router.get('/', (req, res) =>{
    query = `SELECT g.group_id, g.name, g.description, g.open, g.public
    FROM groups g, join_groups_tags j
    WHERE j.tag_id=${req.query.tag_id} AND g.group_id=j.group_id`

    console.log(req.query)
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

// router.get('/', (req, res) => {
//     query = `SELECT g.group_id, g.name, g.description, g.open, g.public
//     FROM groups g, join_groups_tags j`

//     params = req.query
//     if(params !== {}){
//         query = query + ' WHERE'

//         if(params.tag_id){
//             query = query + ` j.tag_id=${req.query.tag_id} AND g.group_id=j.group_id`
//             query = params.term === undefined ? query : query + ' AND'
//         }

//         if(params.term){
//             query = ` g.name LIKE ${params.term}% OR g.description LIKE ${params.term}%`
//         }
//     }

//     query = query + ';';

//     pool.query(query)
//     .then(result => {
//         data = result.rows 
//         if (data.length === 0){
//             return res.status(404).send('No groups found!')
//         }
//         res.send(data)
//     })
//     .catch(e => res.send(e))
// })

module.exports = router
