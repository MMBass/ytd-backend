var express = require('express');
var router = express.Router();

const ytsrController  = require('../controllers/ytsr.controller');

router.get("/", ytsrController.search);

module.exports = router;