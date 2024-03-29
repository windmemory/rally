'use strict';

var express = require('express');
var controller = require('./price.controller');

var router = express.Router();

router.get('/:home', controller.index);

module.exports = router;