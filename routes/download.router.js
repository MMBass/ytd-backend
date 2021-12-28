var express = require('express');
var router = express.Router();

const downController  = require('../controllers/download.controller');

router.get('/', downController.download);

module.exports = router;