const express = require("express");
const multer = require("multer");
const db = require("../config/db");
const fs = require("fs");

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
            ]
        );

    });

    // BULK NOTIFICATION
    if(req.files.length > 3){

        const message =
            `${req.files.length} files uploaded successfully`;

        const sql = `
            INSERT INTO notifications
            (message, type)
            VALUES (?, ?)
        `;

        db.query(sql, [message, "success"]);

        req.io.emit("new-notification", {
            message,
            timestamp: new Date()
        });

    }

    res.json({
        message: "Files uploaded successfully"
    });

});


// GET DOCUMENTS
router.get("/documents", (req, res) => {

    const sql =
        "SELECT * FROM documents ORDER BY id DESC";

    db.query(sql, (err, results) => {

        if(err){
            return res.status(500).json(err);
        }

        res.json(results);

    });

});


// GET NOTIFICATIONS
router.get("/notifications", (req, res) => {

    const sql =
        "SELECT * FROM notifications ORDER BY id DESC";

    db.query(sql, (err, results) => {

        if(err){
            return res.status(500).json(err);
        }

        res.json(results);

    });

});


// DELETE FILE
router.delete("/:id", (req, res) => {

    const id = req.params.id;

    const selectSql =
        "SELECT * FROM documents WHERE id = ?";

    db.query(selectSql, [id], (err, results) => {

        const file = results[0];

        fs.unlink(file.filepath, () => {

            const deleteSql =
                "DELETE FROM documents WHERE id = ?";

            db.query(deleteSql, [id]);

            res.json({
                message: "Deleted Successfully"
            });

        });

    });

});

module.exports = router;