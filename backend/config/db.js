const mongoose = require('mongoose')

function connectToDB(){
    return mongoose.connect(process.env.MONGO_URI).then(() => {
        console.log("Connected to DB");
    })
}

module.exports = connectToDB;
