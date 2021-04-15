const multer = require("multer");

//multer config
var storage = multer.memoryStorage();
var upload = multer({ storage: storage });

module.exports = upload;
