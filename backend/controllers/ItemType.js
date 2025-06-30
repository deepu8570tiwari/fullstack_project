const mongoose=require('mongoose');
const ItemType=require('../models/ItemType');
exports.CreateItemType=async(req,res)=>{
    try {
        const item_type=new ItemType(req.body);
        await item_type.save();
    if(!item_type)
        res.status(402).json({message:"Oops something went wrong, Please try again later"})
    res.status(201).json({message:"New Item type added successfully",data:item_type})
    } catch (error) {
        res.status(404).error({err:message})
    }
}
exports.GetAllItemType=async(req,res)=>{
    try {
        const getallItemType=await ItemType.find();
            res.status(201).json({message:"Get all ItemType Information", data: getallItemType})
    } catch (error) {
        res.status(404).error({err:message})
    }
}
exports.GetSingleItemType=async(req,res)=>{
    try {
        const getSingleItemType=await ItemType.findById(req.params.id);
        if(!getSingleItemType)
            res.status(402).json({message:"Oops something went wrong. try with different Id"});
        res.status(201).json({message:"Get single data bby Id",data:getSingleItemType});
    } catch (error) {
        res.status(404).error({err:message})
    }
}
exports.UpdateItemType=async(req,res)=>{
    try {
        const updateItemType=await ItemType.findByIdAndUpdate(req.params.id, req.body,{new:true})
        if(!updateItemType)
            res.status(402).json({message:"Oops something went wrong. try with different Id"});
        res.status(201).json({message:"Your data has been updated successfully",data:updateItemType});
    } catch (error) {
        res.status(404).error({err:message})
    }
}
exports.DeleteItemType=async(req,res)=>{
    try {
        const deleteItemType=await ItemType.findByIdAndDelete(req.params.id)
        if(!deleteItemType)
            res.status(400).json({mssage:'Oops something went wrong. Try again later'})
        res.status(201).json({message:"Your data has been deleted successfully"});
    } catch (error) {
        res.status(404).error({err:message})
    }
}