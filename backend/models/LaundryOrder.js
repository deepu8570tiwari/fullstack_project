const mongoose=require('mongoose');
const LaundryOrderSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'Users', required: true },
  delivery_person_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Users' },
  business_type: { type: String, required: true },
  pickup_time: Date,
  delivery_time: Date,
  item_details: [
    {
      item_name: String,
      quantity: Number
    }
  ],
  status: { type: String, enum: ['Pending', 'PickedUp', 'Delivered', 'Cancelled'], default: 'PickedUp' },
  notes: String,
  received_by: String
},{ timestamps: true });

module.exports=mongoose.model('LaundryOrder', LaundryOrderSchema);