const express = require('express');
const router = express.Router();
const { Order } = require('../models/order');
const { OrderItem } = require('../models/order-item');
const idValidation = require('../helpers/checkid');

//get all orders
router.get('/', async (req, res) => {
  const orderList = await Order.find()
    .populate('user', ['firstName', 'lastName', 'email'])
    .sort({ dateOrderd: -1 });
  if (!orderList)
    return res.status(404).json({ success: false, message: 'NO Orders found' });
  res.status(200).send(orderList);
});

//get one order by id
router.get('/:id', async (req, res) => {
  idValidation(req, res);
  const order = await Order.findById(req.params.id)
    .populate('user', ['firstName', 'lastName', 'email'])
    .populate({path : 'orderItem', populate: 'item'});
  if (!order)
    return res.status(404).json({ success: false, message: 'NO Orders found' });
  res.status(200).send(order);
});

//create an order
router.post('/', async (req, res) => {
  //combin array item in one promis
  const orderItemsIds = Promise.all(
    req.body.orderItem.map(async (orderItem) => {
      let newOrderItem = new OrderItem({
        quantity: orderItem.quantity,
        item: orderItem.item,
      });
      newOrderItem = await newOrderItem.save();
      return newOrderItem._id;
    })
  );
  //resolve the promis
  const orderItemsIdsResolved = await orderItemsIds;
  let order = new Order({
    orderItem: orderItemsIdsResolved,
    shippingAddress1: req.body.shippingAddress1,
    shippingAddress2: req.body.shippingAddress2,
    phone: req.body.phone,
    status: req.body.status,
    totalPrice: req.body.totalPrice,
    user: req.body.user,
  });
  order = await order.save();
  if (!order) return res.status(400).send('the order can not be found!');
  res.send(order);
});

//update order by id
router.put('/:id', async (req, res) => {
  const order = await Order.findByIdAndUpdate(
    req.params.id,
    {
      status: req.body.status,
    },
    { new: true }
  );

  if (!order) return res.status(400).send('the order cannot be update!');

  res.send(order);
});

// delete order
router.delete('/:id', (req, res) => {
  Order.findByIdAndRemove(req.params.id)
    .then(async (order) => {
      if (order) {
        await order.orderItem.map(async (orderItem) => {
          await OrderItem.findByIdAndRemove(orderItem);
        });
        return res
          .status(200)
          .json({ success: true, message: 'the order is deleted!' });
      } else {
        return res
          .status(404)
          .json({ success: false, message: 'order not found!' });
      }
    })
    .catch((err) => {
      return res.status(500).json({ success: false, error: err });
    });
});

module.exports = router;
