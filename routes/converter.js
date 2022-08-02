const express = require('express');
const router = express.Router();

const { convertToConfluence } = require('../controller/converter');

router.post('/api/convert', convertToConfluence);

module.exports = router;