const mongoose=require('mongoose');
//require('./Admin');
const DeliveryPersonSchema = new mongoose.Schema({
  user_Id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Users', // reference to users table
    required: true
  },
  emergency_number:String,
  vehicle_type: String,
  vehicle_number: String,
  vehicle_model:String,
  vehicle_insurance_number:String,
  driver_licence_number:String,
  driver_licence_expiry:Date,
  driver_aadhar_card_number:String,
  driver_pan_card_number:String
},{ timestamps: true });

module.exports=mongoose.model('DeliveryPerson', DeliveryPersonSchema);