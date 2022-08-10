const { Router } = require('express');
const orderRoutes = require('./order');

const router = Router();

router.get('/', (req, res) => res.send('Milk Distributer'));

router.use(orderRoutes);

module.exports = router;
