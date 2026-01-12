const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator')
const userModel = require('../models/user.model')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

router.post('/register',
    body('email').trim().isEmail().isLength({ min: 13 }),
    body('password').trim().isLength({ min: 5 }),
    body('username').trim().isLength({ min: 3 }),
    async (req, res) => {
        const errors = validationResult(req)

        if(!errors.isEmpty()){
            return res.status(400).json({
                errors: errors.array(),
                message: 'Invalid Data'
            })
        }


        const { email, username, password } = req.body;

        const hashPassword = await bcrypt.hash(password, 10)

        const newUser = await userModel.create({
            email: req.body.email,
            username: req.body.username,
            password: hashPassword
        })

        res.json(newUser)
})

router.get('/register', (req, res) => {
    res.render('register')
})

router.get('/login', (req, res) => {
    res.render('login')
})

router.post('/login', 
    body('username').trim().isLength({ min: 3}),
    body('password').trim().isLength({ min: 5}),
    async (req, res) => {
        const errors = validationResult(req)

        if (!errors.isEmpty()){
            return res.status(400).json({
                errors: errors.array(),
                message: 'Invalid Data'
            })
        }

        const {username, password} = req.body;

        const user = await userModel.findOne({
            username: username
        })

        if (!user){
            return res.status(400).json({
                message: 'username or password is incorrect'
            })
        }

        const isMatch = await bcrypt.compare(password, user.password)

        if(!isMatch){
            return res.status(400).json({
                message: 'username or password is incorrect'
            })
        }

        const token = jwt.sign({
            userId: user._id,
            email: user.email,
            username: user.username
        },
        process.env.JWT_SECRET)
        
        res.cookie('token', token)

        res.send("Logged in")
    }
)

module.exports = router
