const mongoose=require('mongoose')
const express=require('express')
const ItemType=require('../controllers/ItemType');
const router=express.Router();
router
    .post('/',ItemType.CreateItemType)
    .get('/',ItemType.GetAllItemType)
    .get('/:id',ItemType.GetSingleItemType)
    .put('/:id',ItemType.UpdateItemType)
    .delete('/:id',ItemType.DeleteItemType)
module.exports=router
