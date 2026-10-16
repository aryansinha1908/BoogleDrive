const express = require('express');
const router = express.Router();
const File = require("../models/file.model");
const auth = require("../middlewares/auth.middleware");
const upload = require("../middlewares/upload.middleware");
const fileController = require("../controllers/file.controller.js");

router.get("/download/:id", auth, fileController.downloadFile);
router.post("/upload", auth, upload.single("file"), fileController.uploadFile);
router.delete("/delete/:id", auth, fileController.deleteFile);

router.get("/my-files", auth, async (req, res) => {
    const files = await File.find({ owner: req.user.userId });
    res.json(files);
})

module.exports = router;
