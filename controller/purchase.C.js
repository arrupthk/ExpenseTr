
const Razorpay = require('razorpay');
const Order = require('../models/orders');

const purchasePremium = async (req, res, next) => {
  try {
    const razor = new Razorpay({
      key_id: "rzp_test_NuABwB7tfzBQVQ",
      key_secret: "SaNQJqITpMqKukTLjPvM9brU"
    });
    const amount = 1500;

    razor.orders.create({ amount, currency: "INR" }, async (err, order) => {
      if (err) {
        throw new Error(JSON.stringify(err));
      }

      await req.user.createOrder({ order_id: order.id, status: "PENDING" });
      return res.status(201).json({ order, key_id: razor.key_id });
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ success: false, message: 'Internal server error' });
  }
};
const updateTransactionStatus = async (req, res) => {
    try {
      const { payment_id, order_id, status } = req.body;
      console.log(req.body, " requested body");
      const order = await Order.findOne({ where: { order_id: order_id } });
      console.log(order, "printing order here");
      await Promise.all([
        order.update({ payment_id, status: 'SUCCESSFUL' }),
        req.user.update({ ispremiumuser: true })
      ]);
      return res.status(202).json({ success: true, message: 'Transaction successful', ispremiumuser: true });
    } catch (err) {
      console.log(err);
      return res.status(500).json({ success: false, message: 'Internal server error' });
    }
  };  
module.exports = {  
    purchasePremium,
    updateTransactionStatus
  };