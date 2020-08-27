const {pool} = require('../db/pool')

var express = require('express');
var router = express.Router();

//get all users
router.get('/', (req, res) => {
    pool.query('SELECT * FROM users', (e, result) => {
        if(e){
            return res.status(e)
        }

        data = result.rows
        if (data.length === 0){
            return res.send('No users found!')
        }
        res.send(data)
    })
});

//get user by user_id
router.get('/:id', (req, res) => {
    query = `SELECT * FROM users WHERE user_id=${req.params.id};`
    pool.query(query, (e, result) => {
        if(e){
            return res.status(400).send(e)
        }
        
        data.length = result.rows 
        if(data.length === 0){
            return res.status(404).send('User not found!')
        }
        
        res.send(result.rows)
    })
});

//create new user
router.post('/', (req, res) => {
    try{
        params = Object.values(req.body)
        query = 'INSERT INTO users(name, netid, email, timezone) VALUES($1,$2,$3,$4);'
        pool.query(query, params, (e, result) => {
            if(e){
                if(e.code === "23505"){
                    return res.status(400).send('Email already in use!')
                }
                return res.status(400).send(e)
            }

            res.status(201).send('User created succesfully!')
        });
    }catch(e){
        res.status(400).send(e)
    }
    
});

//delete user by user_id
router.delete('/:id', (req, res) => {
    query = `DELETE FROM users WHERE user_id=${req.params.id};`
    pool.query(query, (e, result) => {
        if(e){
            return res.status(400).send(e)
        }

        if(result.rowCount === 0){
            return res.status(404).send('User not found!')
        }

        res.send('User deleted succesfully!')
    })
});

//update user timezone
router.patch('/:id', (req, res) => { 

    query=`UPDATE users SET timezone=${req.body.timezone} WHERE user_id=${req.params.id};`
    pool.query(query, (e, result) => {
        if(e){
            return res.status(400).send(e);
        }
        
        res.send('Timezone updated successfully!')
    })
});


module.exports = router