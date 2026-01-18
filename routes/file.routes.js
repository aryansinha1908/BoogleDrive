const express = require('express');
const router = express.Router();
const fs = require('fs');
const upload = require("../middlewares/upload.middleware");
const File = require("../models/file.model");
const auth = require("../middlewares/auth.middleware");

router.post(
    "/upload",
    auth,
    upload.single("file"),
    async (req, res) => {
        try{
            const file = new File({
                originalName: req.file.originalname,
                storedName: req.file.filename,
                mimeType: req.file.mimetype,
                size: req.file.size,
                path: req.file.path,
                owner: req.user.userId
            });
            await file.save();

            res.json({ success: true, file });
        } catch (err){
            res.status(500).json({ error: "Upload failed" });
        }
    }
);

router.get("/download/:id", auth, async (req, res) => {
    try {
        const file = await File.findById(req.params.id);
        // console.log(file);

        if(!file) return res.status(404).send("File not found");
        
        if (file.owner.toString() !== req.user.userId)
           return res.status(403).send("Unauthorized");

        if (!fs.existsSync(file.path)) {
            return res.status(404).send("File missing on server");
        }
        res.setHeader(
            "Content-Disposition",
            `attachment; filename="${file.originalName}"`
        );
        res.setHeader("Content-Type", file.mimeType);

        const stream = fs.createReadStream(file.path);

        stream.on("error", err => {
            console.error(err);
            res.status(500).end();
        });
        
        stream.pipe(res);
    } catch (err){
        res.status(500).send("Download failed");
    }

});

router.get("/my-files", auth, async (req, res) => {
    const files = await File.find({ owner: req.user.userId });
    res.json(files);
})

module.exports = router;
