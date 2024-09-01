const express = require('express');
const router = express.Router();
const cartController = require('../services/cartService');

router.get('/:cid', cartController.getCartById);

module.exports = router;