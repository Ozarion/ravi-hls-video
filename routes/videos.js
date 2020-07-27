const express = require('express');
const router = express.Router();
const mysql = require('mysql');
const uniqid = require('uniqid');
const url = require('url');
const Downloader = require('node-url-downloader');
const dbConnection = require("../repositories/db");

var multer = require('multer')
// var upload = multer({ dest: 'uploads/' })

// SET STORAGE
var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'public/uploads')
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname)
  }
})

var upload = multer({ storage: storage })

/* GET videos listing. */
router.get('/', function (req, res, next) {
  dbConnection.Get().then(con => {
    con.query("SELECT * FROM videos ORDER BY id DESC", function (err, result, fields) {
      if (err) throw err;
      console.log(result);
      res.render('videos', { Title: 'Videos', videos_data: result, base_url: url.host });
    });
  });
});


router.post('/uploadfile', upload.single('file'), (req, res, next) => {
  dbConnection.Get(con => {

    const file = req.file;
    let file_name = file.filename;
    let video_name = file_name;
    let size = file.size;
    let original_name = file.originalname;
    let slug = uniqid();
    let mimetype = file.mimetype;
    let encoding = file.encoding;

    if (!file) {
      const error = new Error('Please upload a file')
      error.httpStatusCode = 400
      return next(error)
    }

    var sql = `INSERT INTO videos (video_name, original_name, file_name, slug, size, mimetype, encoding) VALUES ('${video_name}','${original_name}', '${file_name}', '${slug}', '${size}', '${mimetype}', '${encoding}') `;
    con.query(sql, function (err, result) {
      if (err) throw err;
      console.log("1 record inserted");
    });

    res.redirect('/videos');
  });
});


router.get('/url', function (req, res, next) {
  const url = 'https://youtu.be/Ie3NX3kZC58';
  const download = new Downloader();
  download.get(url);
  download.on('done', (dst) => {
    // download is finished
    console.log("DOWNLOAD TEST DONE");

    res.send("TEST URL");

  });

  // res.send("TEST URL");
});


module.exports = router;
