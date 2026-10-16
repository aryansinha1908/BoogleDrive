const multer = require("multer");

const upload = multer({
    storage: multer.memoryStorage(),
    limits: { 
        fileSize: 10 * 1024 * 1024,  // 10MB (probably)
        files: 1
    },
})

module.exports = upload;
