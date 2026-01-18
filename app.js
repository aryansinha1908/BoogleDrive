const express = require('express');
const userRouter = require('./routes/user.routes');
const indexRouter = require('./routes/index.routes');
const fileRouter = require('./routes/file.routes');
const dotenv = require('dotenv');
const connectToDB = require('./config/db');
const cookieParser = require('cookie-parser');
const path = require("path");
const fs = require('fs');
const app = express();

dotenv.config();

connectToDB();

const UPLOAD_BASE_PATH = process.env.UPLOAD_BASE_PATH || path.join(__dirname, "uploads");

app.use(express.json())
app.use(express.urlencoded({ extended:true }))
app.use(cookieParser())

app.set('view engine', 'ejs')

if (!fs.existsSync(UPLOAD_BASE_PATH)) {
    fs.mkdirSync(UPLOAD_BASE_PATH, { recursive: true });
}

app.use('/', indexRouter);
app.use('/user', userRouter);
app.use('/files', fileRouter);
app.use('/uploads', express.static(UPLOAD_BASE_PATH))

app.listen(3000)
