'use strict';

var express = require('express');
var controller = require('./people.controller');

var router = express.Router();

router.post('/', controller.create);
router.put('/:id', controller.update);
router.delete('/:id', controller.destroy);

module.exports = router;