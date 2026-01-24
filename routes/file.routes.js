const express = require('express');
const router = express.Router();
const supabase = require("../config/supabase");
const File = require("../models/file.model");
const auth = require("../middlewares/auth.middleware");
const upload = require("../middlewares/upload.middleware");

/* <---- For local Storage Start ----> */

/*
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
*/

/* <---- For local Storage End ----> */

/* <---- Supabase Upload Route Start ----> */

router.post("/upload", auth, upload.single("file"), async (req, res) => {
    try {
        const file = req.file;

        if (!file){
            return res.status(400).json({ error: "No file uploaded" });
        }

        const fileExt = file.originalname.split(".").pop();
        const fileName = `${Date.now()}-${Math.random().toString().substring(2)}.${fileExt}`;

        const { data, error } = await supabase.storage.from(process.env.SUPABASE_BUCKET).upload(fileName, file.buffer, {
            contentType: file.mimetype,
        });

        if (error) {
            console.error(error);
            return res.status(500).json({ error: "Upload to Supabase failed" });
        }

        const { data: publicData } = supabase.storage.from(process.env.SUPABASE_BUCKET).getPublicUrl(fileName);

        const savedFile = await File.create({
            owner: req.user.userId,
            originalName: file.originalname,
            mimeType: file.mimetype,
            size: file.size,
            storagePath: fileName,
            publicUrl: publicData.publicUrl
        });

        res.json({
            message: "File Uploaded Successfully",
            fileId: savedFile._id,
            url: publicData.publicUrl,
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Internal server Error" });
    }
});

/* <---- Supabase Upload Route End ----> */

/* <---- Download Route Starts ----> */

router.get("/download/:id", auth, async (req, res) => {
    const file = await File.findById(req.params.id);

    if (!file) return res.status(404).send("File not found");
    if (file.owner.toString() !== req.user.userId)
        return res.status(403).send("Unauthorized");

    // return res.redirect(file.publicUrl);

    const { data } = await supabase.storage.from("files").createSignedUrl(file.storagePath, 60);
    res.redirect(data.signedUrl);
});

/* <---- Download Route End ----> */

router.get("/my-files", auth, async (req, res) => {
    const files = await File.find({ owner: req.user.userId });
    res.json(files);
})

router.delete("/delete/:id", auth, async (req, res) => {
    const file = await File.findById(req.params.id);
    
    if (!file){
        return res.status(404).send("Not Found");
    }
    if (file.owner.toString() !== req.user.userId){
        return res.status(403).send("Unauthorized");
    }

    await supabase.storage.from("files").remove([file.storagePath]);
    await file.deleteOne();
    res.send("Deleted");
})

module.exports = router;
