const { Show, User} = require('../models/index')
const express = require('express')
const router = express.Router()

const { check, validationResult } = require('express-validator')

/*
Users
GET all users
GET one user
GET all shows watched by a user (user id in req.params)
PUT update and add a show if a user has watched it */

router.get('/users', async (req, res) => {

    const allUsers = await User.findAll()
    res.json(allUsers)
})

router.get('/users/:id', async (req, res) => {
    const user = await User.findByPk(req.params.id)
    res.json(user)
})

router.get('/users/:id/shows', async (req, res) => {
    const user = await User.findByPk(req.params.id)       


    const shows = await Show.findAll({
        where: {
            userId: req.params.id 
        }
    })

    res.json(shows)
})

//PUT update and add a show if a user has watched it
router.put('/users/:id/shows/:showid', async (req, res) => {
    const user = await User.findByPk(req.params.id)
    const show = await Show.findByPk(req.params.showid)

    await user.addShow(show)

    res.json(user)
})

/*
Shows
GET all shows
GET one show
GET shows of a particular genre (genre in req.params)
PUT update rating of a show that has been watched
PUT update the status of a show
DELETE a show */

router.get('/shows', async (req, res) => {
    const shows = await Show.findAll()

    res.json(shows)
})

router.get('/shows/:id', async (req, res) => {
    const show = await Show.findByPk(req.params.id)

    res.json(show)
})

router.get('/shows/genre/:id', async (req, res) => {
    const genreShows = await Show.findAll({
        where: {
            genre: req.params.id
        }
    })

    res.json(genreShows)
})

//PUT update rating of a show that has been watched

//update show rating 
/*
    Use server-side validation in your routes to ensure that:
    If a user tries to make a request to update the rating of a show, 
    the “rating” field cannot be empty or contain whitespace
*/
router.put('/shows/:id/users/:userId', [check("rating").not().isEmpty().trim()], 
async (req, res) => {
    
    const errors = validationResult(req)

    if(!errors.isEmpty()){
        res.json({error: errors.array()})
    }
    else{
        const shows = await Show.findOne({
            where: {
                id: req.params.id,
                userId: req.params.userId
            }
        })
        //find individual show 
        console.log("SHOWS: ", shows)
        //const show = shows.filter(show => show.id == req.params.id)

        await shows.update({rating: req.body.rating})
        
        res.json(shows)
    }
})

//PUT update the status of a show

//updating show status
    //Use server-side validation in your routes to ensure that:
    //If a user tries to make a request to update the status of a show, 
    //  the “status” field cannot be empty or contain whitespace.
    //The status must be a minimum of 5 characters and a maximum of 25 characters
router.put('/shows/:id', [check("status").not().isEmpty().trim().isLength({min: 5, max: 25})], async (req, res) => {
    
    const errors = validationResult(req)

    if(!errors.isEmpty()){

        res.json({error: errors.array()})
    }else {
        //status either: on-going or cancelled 
        const show = await Show.findByPk(req.params.id)

        await show.update({status: req.body.status})
        res.json(show)
    }
})


router.delete('/shows/:id', async (req, res) => {
    const deletedShow = await Show.destroy({
        where: {
            id: req.params.id
        }
    })

    const allShows = await Show.findAll()
    res.json(allShows)

})

module.exports = router