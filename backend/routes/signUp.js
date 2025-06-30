const mongoose=require('mongoose');
const express=require('express')
const signUpController =require('../controllers/Admin');
const { identifier } = require('../middlewares/identification');
const router=express.Router();
router.post('/signup',signUpController.signUp);
router.post('/signin',signUpController.signIn);
router.post('/signout',identifier,signUpController.signOut);
router.patch('/send-verification-code',identifier,signUpController.sendVerificationCode)
router.patch('/verify-verification-code',identifier,signUpController.verifyVerificationCode)
router.patch('/change-password',identifier,signUpController.changePassword)
router.patch('/send-forgot-password-code',signUpController.sendForgotPasswordCode)
router.patch('/verify-forgot-password-code',signUpController.verifyForgotPasswordCode)
module.exports=router;