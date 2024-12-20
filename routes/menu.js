const express = require('express');
const { getMenu } = require('../controllers/menuController');

const router = express.Router();

// Route to fetch menu items
router.get('/', getMenu);

module.exports = router;
