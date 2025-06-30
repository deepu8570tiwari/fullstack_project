const { signupschema, signInschema, acceptCodeschema, changePasswordSchema, acceptforgetPasswordSchema } = require("../middlewares/validator");
const User=require('../models/Admin');
const deliveryPerson=require('../models/DeliveryPerson');
const {doHash, doHashValidation, hmacProcess}=require('../utils/hashing')
const jwt =require('jsonwebtoken');//Used for authentication and session management.
const transport=require('../middlewares/sendMailer');
exports.signUp= async (req,res)=>{
    const {name, email, password,business_name,business_type,business_phone,business_address }= req.body;
    try {
        const {error,value}=signupschema.validate(req.body)
        if(error){
            return res.status(401).json({success:false,message:error.details[0].message})
        }
        const existingUser = await User.findOne({email})
        if(existingUser){
            return res.status(401).json({success:false,message:"User Already Exist!"})
        }
        const hashedPassword=await doHash(password,12)
        const newUser=new User({
            name,
            email,
            password:hashedPassword,
            business_name,
            business_type,
            business_phone,
            business_address
        })
        const result=await newUser.save();
        result.password=undefined;
        res.status(201).json({
            success:true,
            message:"Your account has been created successfully",
            result
        })
    } catch (error) {
        console.log(error)
    }
}
exports.signIn=async(req,res)=>{
    const {email,password}=req.body;
    try {
         const {error,value}=signInschema.validate({email,password})
         if(error){
              return res.status(401).json({success:false,message:error.details[0].message})
         }
         const existingUser=await User.findOne({email}).select('+password')
         if(!existingUser){
             return res.status(401).json({success:false,message:"User does not Exist!"})
         }
         const result=await doHashValidation(password,existingUser.password)
         if(!result){
            return res.status(401).json({success:false,message:'Invalid Credentials'});
         }
         const token=jwt.sign({
            userId:existingUser._id,
            email:existingUser.email,
            verified:existingUser.verified,
            role: existingUser.business_type
         },process.env.TOKEN_SECRET,
        {
            expiresIn:'8h'
        })
        const resulted_data={
            name:existingUser.name,
            email:existingUser.email,
            role:existingUser.business_type,
        }
         res.cookie('Authorization','Bearer'+ token,{expires: new Date(Date.now()+ 8 *3600000), httpOnly:process.env.NODE_ENV==='production',secure:process.env.NODE_ENV==='production'}).json({
            sucess:true,
            token,
            resulted_data,
            message:'logged in successfully'
         })
    } catch (error) {
        console.log(error)
    }
}
exports.signOut=async(req,res)=>{
    res
    .clearCookie('Authorization')
    .status(200)
    .json({success:true,message:'Logged out successfully'});
}
exports.sendVerificationCode=async(req,res)=>{
    const {email}=req.body;
    try {
        const existingUser=await User.findOne({email})
        if(!existingUser){
            return res
                .status(401)
                .json({success:false,message:"Your does not exist"})
        }
        if(existingUser.verified){
            return res
                .status(400)
                .json({success:false,message:"You are already verified"})
        }
        const codeValue=Math.floor(Math.random()*1000000).toString();
        let information=await transport.sendMail({
            from:process.env.NODE_CODE_SENDING_EMAIL_ADDRESS,
            to:existingUser.email,
            subject:"Verification Code",
            html:'<h1>'+codeValue+'</h1>'
        })
        if(information.accepted[0]===existingUser.email){
            const hashedCodeValue=hmacProcess(codeValue,process.env.HMAC_VERIFICATION_CODE_SECRET)
            existingUser.verificationCode=hashedCodeValue;
            existingUser.verificationCodeValidation=Date.now();
            await existingUser.save();
            return res.status(200).json({success:true,message:"Code sent"});
        }
        res.status(400).json({success:false,message:"Code not sent"});
    } catch (error) {
        console.log(error)
    }
}
exports.verifyVerificationCode=async(req,res)=>{
    const {email,providedCode}=req.body;
    try {
        const {error,value}=acceptCodeschema.validate({email,providedCode})
         if(error){
              return res.status(401).json({success:false,message:error.details[0].message})
         }
        const codeValue=providedCode.toString();
        const existingUser = await User.findOne({ email }).select('+verificationCode +verificationCodeValidation');
        if(!existingUser){
            return res
                .status(400)
                .json({success:false,message:"User doesn't exist"})
        }
        if(existingUser.verified){
             return res
                .status(400)
                .json({success:false,message:"You're already Verified"});
        }
        if(!existingUser.verificationCode || !existingUser.verificationCodeValidation){
             return res
                .status(400)
                .json({success:false,message:"Something is wrong with Verfication Code"});
        }
        if(Date.now()- existingUser.verificationCodeValidation>5*60*1000){
            return res
                .status(400)
                .json({success:false,message:"Code has been expired"});
        }
        const hashedCodeValue=hmacProcess(codeValue,process.env.HMAC_VERIFICATION_CODE_SECRET)
        if(hashedCodeValue===existingUser.verificationCode){
            existingUser.verified=true;
            existingUser.verificationCode=undefined;
            existingUser.verificationCodeValidation=undefined;
            await existingUser.save();
            return res
                .status(200)
                .json({success:false,message:"Your account has been verified"});
        }
         return res
                .status(200)
                .json({success:false,message:"Unexpected error occured!"});

    } catch (error) {
        console.log(error)
    }
}
exports.changePassword=async(req,res)=>{
    const {userId,verified}=req.user;
    const {oldPassword,newPassword}=req.body;
    try {
        const {error,value}=changePasswordSchema.validate({oldPassword,newPassword})
         if(error){
              return res.status(401).json({success:false,message:error.details[0].message})
         }
        const existingUser = await User.findOne({ _id: userId }).select('+password');
         if(!existingUser){
            return res
                    .status(401)
                    .json({status:false, message:"user doesn't exist"})
         }
         const result= await doHashValidation(oldPassword,existingUser.password);
         if(!result){
            return res
                    .status(401)
                    .json({success:false,message:"Invalid Credentials"});
         }
         const hashedPassword=await doHash(newPassword,12);
         existingUser.password=hashedPassword;
         await existingUser.save();
         return res
                .status(200)
                .json({success:true,message:"Password Updated Successfully"})
    } catch (error) {
        console.log(error)
    }
}

exports.sendForgotPasswordCode=async(req,res)=>{
    const {email}=req.body;
    try {
        const existingUser=await User.findOne({email})
        if(!existingUser){
            return res
                .status(401)
                .json({success:false,message:"User does not exist"})
        }
        
        const codeValue=Math.floor(Math.random()*1000000).toString();
        let information=await transport.sendMail({
            from:process.env.NODE_CODE_SENDING_EMAIL_ADDRESS,
            to:existingUser.email,
            subject:"Forgot Code",
            html:'<h1>'+codeValue+'</h1>'
        })
        if(information.accepted[0]===existingUser.email){
            const hashedCodeValue=hmacProcess(codeValue,process.env.HMAC_VERIFICATION_CODE_SECRET)
            existingUser.forgetPasswordCode=hashedCodeValue;
            existingUser.forgetpasswordCodeValidation=Date.now();
            await existingUser.save();
            return res.status(200).json({success:true,message:"Code sent"});
        }
        res.status(400).json({success:false,message:"Code not sent"});
    } catch (error) {
        console.log(error)
    }
}
exports.verifyForgotPasswordCode=async(req,res)=>{
    const {email,providedCode,newPassword}=req.body;
    try {
        const {error,value}=acceptforgetPasswordSchema.validate({email,providedCode,newPassword})
         if(error){
              return res.status(401).json({success:false,message:error.details[0].message})
         }
        const codeValue=providedCode.toString();
        const existingUser = await User.findOne({ email }).select('+forgetPasswordCode +forgetpasswordCodeValidation');
        if(!existingUser){
            return res
                .status(400)
                .json({success:false,message:"User doesn't exist"})
        }
        
        if(!existingUser.forgetPasswordCode || !existingUser.forgetpasswordCodeValidation){
             return res
                .status(400)
                .json({success:false,message:"Something is wrong with Verfication Code"});
        }
        if(Date.now()- existingUser.forgetpasswordCodeValidation>5*60*1000){
            return res
                .status(400)
                .json({success:false,message:"Code has been expired"});
        }
        const hashedCodeValue=hmacProcess(codeValue,process.env.HMAC_VERIFICATION_CODE_SECRET)
        if(hashedCodeValue===existingUser.forgetPasswordCode){
            const hashedPassword=await doHash(newPassword,12);
            existingUser.password=hashedPassword;
            existingUser.forgetPasswordCode=undefined;
            existingUser.forgetpasswordCodeValidation=undefined;
            await existingUser.save();
            return res
                .status(200)
                .json({success:false,message:"Your password has been changed"});
        }
         return res
                .status(200)
                .json({success:false,message:"Unexpected error occured!"});

    } catch (error) {
        console.log(error)
    }
}