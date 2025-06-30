const mongoose= require('mongoose');
const Business_Schema=new mongoose.Schema({
    business_type: String,
},{timestamps: true})
module.exports=mongoose.model('business_type',Business_Schema)