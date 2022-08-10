const { Router } = require('express');
const orderRoutes = require('./order');
const capacityRoutes = require('./capacity');

const router = Router();

router.get('/', (req, res) => res.send('Milk Distributer'));

router.use('/order', orderRoutes);
router.use('/capacity', capacityRoutes);

module.exports = router;
