'use strict';

var express = require('express');
var controller = require('./modifier.controller');

var router = express.Router();

router.put('/swap/:index', controller.swap);

module.exports = router;