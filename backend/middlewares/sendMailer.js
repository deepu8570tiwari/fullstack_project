const nodemailer=require('nodemailer')
require('dotenv').config();
const transport=nodemailer.createTransport({
    host: "smtp.gmail.com",         // e.g., smtp.gmail.com
    port: 587,
    secure: false,  
    auth:{
        user:process.env.NODE_CODE_SENDING_EMAIL_ADDRESS,
        pass:process.env.NODE_CODE_SENDING_EMAIL_PASSWORD
    }
})
module.exports=transport;