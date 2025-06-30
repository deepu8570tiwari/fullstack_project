const { default: params } = require('js-crypto-hmac/dist/params');
const BusinessType=require('../models/BusinessType');
exports.CreateBusinessType=async(req,res)=>{
    try {
        const business_type=new BusinessType(req.body)
        await business_type.save();
        res.status(201).json({message:"Business Type created Successfully",data:business_type});
    } catch (error) {
         res.status(400).json({ error: err.message });
    }
}
exports.GetAllBusinessType=async(req,res)=>{
    try {
        const getAllBusinessType=await BusinessType.find();
        res.status(201).json({message:"Get all Business Type information",data:getAllBusinessType});
    } catch (error) {
        res.status(400).json({error:err.message})
    }
}
exports.GetSingleBusinessType=async(req,res)=>{
    try {
        const getsingleBusinessType=await BusinessType.findById(req.params.id);
        if(!getsingleBusinessType) res.status(400).json({message:'Business Type is not found'});
        res.status(201).json({message:"Single Business Type",data:getsingleBusinessType})
    } catch (error) {
        res.status(400).json({error:err.message});
    }
}
exports.UpdateBusinessType=async(req,res)=>{
    try {
        const getupdatedresult=await BusinessType.findByIdAndUpdate(req.params.id, req.body,{new:true});
        if(!getupdatedresult) 
            res.status(400).json({message:'Oops something went wrong. Try again later'})
        res.status(201).json({message:'Business Type Updated Successfully', data: getupdatedresult});
    } catch (error) {
        res.status(400).json({error:err.message})
    }
}
exports.DeleteBusinessType=async(req,res)=>{
    try {
        const deletebusinesstype=await BusinessType.findByIdAndDelete(req.params.id)
        if(!deletebusinesstype)
            res.status(400).json({mssage:'Oops something went wrong. Try again later'})
        res.status(201).json({message:"Business Type Deleted Successfully"});
    } catch (error) {
        res.status(400).json({error:err.message})
    }
}