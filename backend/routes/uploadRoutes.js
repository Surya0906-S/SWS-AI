const express = require("express");
const multer = require("multer");

const router = express.Router();

const storage = multer.diskStorage({

    destination: (req, file, cb) => {
        cb(null, "uploads/");
    },

    filename: (req, file, cb) => {
        cb(null, Date.now() + "-" + file.originalname);
    }

});

const upload = multer({ storage });

router.post("/", upload.array("files"), (req, res) => {

    console.log(req.files);

    res.json({
        message: "Files uploaded successfully"
    });

});

module.exports = router;