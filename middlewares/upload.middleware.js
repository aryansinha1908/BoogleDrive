const multer = require("multer");
const path = require("path");
const fs = require("fs");

const basePath = process.env.UPLOAD_BASE_PATH || "uploads";

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        let folder = "files";

        if (file.mimetype.startsWith("image/")) folder = "images";
        else if (file.mimetype.startsWith("video/")) folder = "videos";

        const uploadPath = path.join(basePath, folder);

        fs.mkdirSync(uploadPath, {recursive: true});

        cb(null, uploadPath);
    },
    filename: (req, file, cb) => {
        const uniqueName = Date.now() + "-" + Math.round(Math.random() * 1e9);
        cb(null, uniqueName + path.extname(file.originalname));
    }
});

module.exports = multer({ storage });
