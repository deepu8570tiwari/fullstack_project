const express= require('express');
const BusinessTypeController=require('../controllers/BusinessType');
const router=express.Router();
router
    .post('/',BusinessTypeController.CreateBusinessType)
    .get('/',BusinessTypeController.GetAllBusinessType)
    .get('/:id',BusinessTypeController.GetSingleBusinessType)
    .put('/:id',BusinessTypeController.UpdateBusinessType)
    .delete('/:id',BusinessTypeController.DeleteBusinessType)
module.exports=router;