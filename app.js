const express = require('express')
const userRouter = require('./routes/user.routes')
const indexRouter = require('./routes/index.routes')
const dotenv = require('dotenv')
const connectToDB = require('./config/db')
const cookieParser = require('cookie-parser')
const app = express()

dotenv.config();

connectToDB();

app.use(express.json())
app.use(express.urlencoded({ extended:true }))
app.use(cookieParser())
app.set('view engine', 'ejs')

app.use('/user', userRouter);
app.use('/', indexRouter);

app.listen(3000)
