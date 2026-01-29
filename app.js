const dotenv = require('dotenv');
dotenv.config();

const express = require('express');
const userRouter = require('./routes/user.routes');
const indexRouter = require('./routes/index.routes');
const fileRouter = require('./routes/file.routes');
const connectToDB = require('./config/db');
const cookieParser = require('cookie-parser');
const rateLimit = require("express-rate-limit");
const app = express();

connectToDB();

app.use(cookieParser())
app.use("/file", rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100
}))

app.use('/', indexRouter);
app.use('/user', userRouter);
app.use('/files', fileRouter);

const PORT = process.env.PORT || 3000
app.listen(PORT)
