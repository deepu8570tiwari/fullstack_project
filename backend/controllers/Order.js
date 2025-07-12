const Order = require('../models/LaundryOrder');
const Subscription = require('../models/UserSubscription');
const Admin=require('../models/Admin');
exports.createOrder = async (req, res) => {
  try {
    const { userId, business_name } = req.body;
    // 1. Check if user has an active subscription
    const activeSub = await Subscription.findOne({
      userId,
      status: { $in: ['active', 'trialing'] },
      cancelAtPeriodEnd: false
    });

    if (!activeSub) {
      return res.status(403).json({
        message: `${business_name} must have an active subscription to place an order.`
      });
    }
    // 2. Create the order
    const order = new Order(req.body);
    await order.save();
    res.status(201).json({data:order,message:"Order Created Successfully"});

  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate('userId','name email business_name business_type business_address business_phone') // adjust fields as needed
      .populate('delivery_person_id', 'name email business_address business_phone')
    res.json(orders);
  } catch (err) {
    console.error('Error fetching orders:', err);
    res.status(500).json({ error: 'Failed to fetch orders' });
  }
};
exports.getSingleOrders=async(req,res)=>{
  try {
      const getSingleOrder=await Order.findById(req.params.id);
      if(!getSingleItemType)
          res.status(402).json({message:"Oops something went wrong. try with different Id"});
      res.status(201).json({message:"Get single data by Id",data:getSingleOrder});
      } catch (error) {
          res.status(404).error({err:message})
      }
}
exports.updateOrder = async (req, res) => {
  try {
    const order = await Order.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(order);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};
// PUT /api/v1/order/update-status/:orderId
exports.updateOrderStatus = async (req, res) => {
  const { orderId } = req.params;
  const { newStatus } = req.body;
  const validStatuses = ['pending', 'picked_up', 'in_process', 'completed'];

  if (!validStatuses.includes(newStatus)) {
    return res.status(400).json({ error: 'Invalid status value' });
  }

  try {
    const updatedOrder = await Order.findByIdAndUpdate(
      orderId,
      { status: newStatus },
      { new: true }
    );

    if (!updatedOrder) {
      return res.status(404).json({ error: 'Order not found' });
    }

    return res.json({
      message: `Order status updated to ${newStatus}`,
      order: updatedOrder
    });
  } catch (err) {
    console.error('Error updating order status:', err);
    return res.status(500).json({ error: 'Failed to update order status' });
  }
};

exports.deleteOrder = async (req, res) => {
  await Order.findByIdAndDelete(req.params.id);
  res.status(204).send();
};
