const express = require("express");
const authenticate = require("../authenticate");
const multer = require("multer");
const cors = require("./cors");

const storage = multer.diskStorage({      //storage options
    destination: (req, file, cb) => {          //save to destination public/images
        cb(null, "public/images");          //null means there is no error
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname);        //Keeps the original name of the file, not multer generated name
    }
});

const imageFileFilter = (req, file, cb) => {
    if(!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)){   //checks for only these image file files.
        return cb(new Error("You can upload only image files!"), false);  //returns error if not one of types above. false tells multer to reject
    }
    cb(null, true);
};

const upload = multer({storage: storage, fileFilter: imageFileFilter}); //Pass in the options from above to multer. configuration complete

const uploadRouter = express.Router();    //create upload router

uploadRouter.route("/")
.options(cors.corsWithOptions, (req, res) => {
    res.sendStatus(200);
})
.get(cors.cors, authenticate.verifyUser, authenticate.verifyAdmin, (req, res) => {
    res.statusCode = 403;
    res.end(`GET operations not supported on /imageUpload.`);
})
.post(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, upload.single("imageFile"), (req, res) => {  //add multer middleware for single file upload
    res.statusCode = 200;
    res.setHeader("Content-Type", "application/json");
    res.json(req.file);  //send the information back to the client
})
.put(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res) => {
    res.statusCode = 403;
    res.end(`PUT operations not supported on /imageUpload.`);
})
.delete(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res) => {
    res.statusCode = 403;
    res.end(`DELETE operations not supported on /imageUpload.`);
});

module.exports = uploadRouter;