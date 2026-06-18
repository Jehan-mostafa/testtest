const express = require('express');
const router = express.Router();
const {
  createOrder,
  getOrders,
  getOrderById,
  updateOrderStatus,
  cancelOrder
} = require('../controller/orderController');
const { protect } = require('../middleware/auth.middleware');


router.use(protect);

router.route('/')
  .post(createOrder)
  .get(getOrders);

router.route('/:orderId')
  .get(getOrderById)
  .put(updateOrderStatus)
  .delete(cancelOrder);

module.exports = router;