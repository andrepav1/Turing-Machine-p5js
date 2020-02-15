var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/projects/turingmachine', function(req, res, next) {
  res.render('turingmachine');
});

router.get('/', function(req, res, next) {
  res.render('turingmachine', { title: 'Express' });
});

module.exports = router;
