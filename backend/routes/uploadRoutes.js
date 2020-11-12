import express from 'express';
import multer from 'multer';
import path from 'path';

const router = express.Router();

const storage = multer.diskStorage({
    destination(req, file, cb) {
        cb(null, "Uploads/");
    },
    filename(req, file, cb) {
        cb(null, `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`)
    }

})

const checkfileType = (file, cb) => {

    const fileType = /jpeg|jpg|png/;
    const validFileType = fileType.test(path.extname(file.originalname.toLowerCase()));
    const validMimeType = fileType.test(file.mimetype);


    if (validFileType && validMimeType) {
        return cb(null, true)
    } else {
        return cb(new Error("Upload Images Only!"), false);

    }

}
const upload = multer({
    storage: storage,
    fileFilter: (req, file, cb) => {
        checkfileType(file, cb);
    }

})

router.post("/", upload.single("image"), (req, res) => {
    res.send(`\\${req.file.path}`);
})

export default router;

