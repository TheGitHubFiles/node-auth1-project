const express = require('express')
const bcrypt = require('bcryptjs')
const User = require('../user/user-model')
const router = express.Router()


const checkUsernameExists = async (req, res, next) => {
    // username must be in the db already
    // we should also tack the user in db to the req object for convenience
    try {
        const rows = await User.getBy({ username: req.body.username })
        if (rows.length) {
            req.userData = rows[0]
            next()
        } else {
            res.status(401).json('who is that exactly?')
        }
    } catch (err) {
        res.status(500).json('something failed tragically')
    }
}

router.post('/register', async (req, res) => {

    try {
        const hash = bcrypt.hashSync(req.body.password, 10)
        const nUser = await User.add({ username: req.body.username, password: hash })
        res.status(201).json(nUser)
    }
    catch (e) {
        res.status(500).json({ message: e.message })
    }
})
router.post('/login', checkUsernameExists, (req, res) => {
    try {
        console.log('logging in')
        const verifies = bcrypt.compareSync(req.body.password, req.userData.password)
        if (verifies) {
            console.log('we should save a session for this user')

            req.session.user = req.userData
            res.json(`Welcome back, ${req.userData.username}`)
        } else {
            res.status(401).json('bad credentials')
        }
    } catch (e) {
        res.status(500).json(e.message)
    }
})
module.exports = router;