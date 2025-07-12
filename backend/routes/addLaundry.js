const express= require('express');
const LaundryController=require('../controllers/Order.js');
const router=express.Router();
router
    .post('/',LaundryController.createOrder)
    .get('/',LaundryController.getAllOrders)
    .get('/:orderId',LaundryController.getSingleOrders)
    .put('/update-status/:orderId',LaundryController.updateOrderStatus)
    .put('/:id',LaundryController.updateOrder)
    .delete('/:id',LaundryController.deleteOrder)
module.exports=router;