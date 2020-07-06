var express = require('express');
var router = express.Router();

/* GET settings listing. */
router.get('/', function (req, res, next) {
    res.render('settings', { Title: 'Setup' });
});

module.exports = router;