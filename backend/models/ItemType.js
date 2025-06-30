const mongoose=require('mongoose');
const ItemTypes=new mongoose.Schema({
    items_type:String
},{timestamps: true})
module.exports= mongoose.model('item_type',ItemTypes)