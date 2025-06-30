const mongoose=require('mongoose');
const LaundryOrderSchema = new mongoose.Schema({
  client_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Client', required: true },
  delivery_person_id: { type: mongoose.Schema.Types.ObjectId, ref: 'DeliveryPerson' },
  category: { type: String, enum: ['Salon', 'Hotel', 'Hospital'], required: true },
  item_details: [
    {
      item_name: String,
      quantity: Number
    }
  ],
  pickup_time: Date,
  delivery_time: Date,
  status: { type: String, enum: ['Pending', 'Picked up', 'Delivered', 'Cancelled'], default: 'Pending' },
  notes: String,
  received_by: String
},{ timestamps: true });

module.exports=mongoose.model('LaundryOrder', LaundryOrderSchema);