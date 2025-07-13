const mongoose=require('mongoose');

const AdminSchema = new mongoose.Schema({
  name: { type: String, required: [true,"Name is required"]},
  email: { type: String, unique: [true,"Email Must be unique"], trim:true },
  password:{type:String,required:[true,"Password fill should not be empty"], trim: true,select:false},
  business_name: { 
    type: String, 
    trim: true 
  },
  business_type: { 
    type: String, 
    enum: ['admin', 'manager', 'salon', 'hospital', 'hotel','delivery','air-bnb','flat-owner'], 
    default: 'Client' 
  },
  business_address: { 
    type: String, 
    trim: true 
  },
  business_phone: { 
    type: Number, 
    trim: true 
  },
  avatar:{
    type: String, 
    trim: true 
  },
  permissions: [String],
  verified:{
    type:Boolean,
    default:false,
  },
  verificationCode:{
    type:String,
    select:false,
  },
  verificationCodeValidation:{
    type:Number,
    select:false,
  },
  forgetPasswordCode:{
    type:String,
    select:false,
  },
  forgetpasswordCodeValidation:{
    type:Number,
    select:false,
  },
  stripeCustomerId:{ type: String},
  permissions: [String],
  activity_logs: [
    {
      action: String,
      timestamp: { type: Date, default: Date.now }
    }
  ]
},{ timestamps: true }
);

module.exports= mongoose.model('Users', AdminSchema);