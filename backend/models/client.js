const mongoose=require('mongoose');

const clientSchema = new mongoose.Schema({
  business_name: { type: String },
  business_type: { type: String, enum: ['Salon', 'Hotel', 'Hospital'], required: true },
  location: {
    address: String,
    city: String,
    state: String,
    pincode: String,
  },
  contactPerson: String,
  contactPhone: String,
  contactEmail: String,
  is_active: { type: Boolean, default: true },
  created_by: { type: mongoose.Schema.Types.ObjectId, ref: 'Admin' }
},{ timestamps: true });
module.exports= mongoose.model('Client', clientSchema);