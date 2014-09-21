'use strict';

var express = require('express');
var controller = require('./testAPI.controller');

var router = express.Router();

/****************
 * Sample Route below:
 * NOTE: route logic is in 'testAPI.controller.js'.
 ***************/

router.get('/', controller.index); // basic GET '/' route. Find this in 'testAPI.controller.js : index'
router.get('/:id', controller.show);
router.post('/', controller.create);
router.put('/:id', controller.update);
router.patch('/:id', controller.update);
router.delete('/:id', controller.destroy);

module.exports = router;