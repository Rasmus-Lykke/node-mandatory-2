const router = require("express").Router();
const crypto = require("crypto");
const multer = require('multer');
const fs = require("fs");
var obj = {
    pictures: []
};

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'pictures/');
    },
    filename: (req, file, cb) => {
        const mimetypeArray = file.mimetype.split("/");
        if (mimetypeArray[0] === "image") {
            const extension = mimetypeArray[mimetypeArray.length - 1];
            const fileName = crypto.randomBytes(18).toString("hex");

            cb(null, fileName + "." + extension);
        } else {
            cb("Error: File is not a picture")
        };
    }
});

const upload = multer({
    storage: storage
});

// The picture information are for now saved in a json file called myjsonfile.json.
// It is intended to convert this to a database in the near future. This would also make it easier with implementing comments. 
function writeToFile() {
    var json = JSON.stringify(obj);
    fs.writeFile('myjsonfile.json', json, 'utf8', (err, data) => {
        if (err) {
            console.log(err);
        } else {
            console.log("Write successful!");
        };
    });
};


const picturesPerPage = 12;
router.get("/pictures", (req, res) => {
    const page = Number(req.query.page) ? Number(req.query.page) : 1;
    const start = (page - 1) * picturesPerPage;
    const end = start + picturesPerPage;

    return res.send({
        response: obj.pictures.slice(start, end)
    });
});

router.get("/pictures/:pictureId", (req, res) => {
    return res.send({
        response: obj.pictures.find(picture => picture.fileName === req.params.pictureId)
    });
});


router.post("/pictures", upload.single('uploadedpicture'), (req, res) => {
    const picture = {
        title: req.body.title.trim(),
        description: req.body.description,
        thumbnail: "",
        fileName: req.file.filename,
        uploadDate: new Date(),
        category: req.body.category,
        //Regex 
        tags: req.body.tags.split(/\s*[,\s]\s*/)
        //tags: req.body.tags.replace(","," ").split(" ")
    };

    // Server validation of the uploaded image in information typed by the user. 
    const titleMaxLength = 128;
    if (picture.title.length === 0 || picture.title.length > titleMaxLength) {
        return res.status(400).send({
            response: `Error: title length is ${picture.title.length} but must be more than 0 or less than ${titleMaxLength}`
        });
    };

    const descriptionMaxLength = 2048;
    if (picture.description.length > descriptionMaxLength) {
        return res.status(400).send({
            response: `Error: description length is ${picture.description.length} but must be less than ${descriptionMaxLength}`
        })
    };

    // 250MB
    const fileSizeLimit = 262144000;
    if (req.file.size > fileSizeLimit) {
        fileValid = false
        return res.status(400).send({
            response: `Error: pictures size is ${req.file.size} but must be less than ${fileSizeLimit}`
        })
    };

    const tagsMaxLength = 8;
    if (picture.tags.length > tagsMaxLength) {
        return res.status(400).send({
            response: `Error: Amount of tags is ${picture.tags.length} but must be less than ${tagsMaxLength}`
        })
    };


    obj.pictures.push(picture);
    writeToFile();

    return res.redirect("/");
});

module.exports = {
    router: router,
    readFromFile: function () {
        fs.readFile('myjsonfile.json', 'utf8', (err, data) => {
            if (err) {
                console.log(err);
            } else {
                console.log("Read successful!")
                obj = JSON.parse(data); //now it an object
            };
        });
    }
};