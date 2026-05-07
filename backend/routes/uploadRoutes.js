const express = require("express");
const multer = require("multer");
const db = require("../config/db");

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

    req.files.forEach((file) => {

        const sql = `
            INSERT INTO documents
            (filename, filesize, filetype, filepath, status)
            VALUES (?, ?, ?, ?, ?)
        `;

        db.query(
            sql,
            [
                file.originalname,
                file.size,
                file.mimetype,
                file.path,
                "complete"
            ],
            (err, result) => {

                if(err){
                    console.log("Insert Error:", err);
                } else {
                    console.log("Inserted Successfully");
                }

            }
        );

    });

    res.json({
        message: "Files uploaded successfully"
    });

});

module.exports = router;