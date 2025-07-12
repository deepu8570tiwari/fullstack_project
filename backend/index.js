// index.js
const express = require('express');//Core framework for building APIs and handling HTTP requests/responses.
const cors = require('cors');//Allows your backend to accept requests from different domains 
const mongoose = require('mongoose');//Connects to MongoDB and defines schemas/models for structured data.
require('dotenv').config();//Keeps secrets like DB credentials, API keys out of your code.

const helmet= require('helmet');//Protects against common vulnerabilities like XSS, clickjacking, etc.
const cookieParser = require('cookie-parser');//Helps you read cookies sent by the client (e.g., auth tokens).
const clientRouter = require('./routes/client');
const paymentRoutes = require('./routes/paymentMethod');
const deliveryPersonRoutes = require('./routes/deliveryPersonRoutes');
const signUpRoutes=require('./routes/signUp');
const businessType=require('./routes/BusinessType');
const Itemtype=require('./routes/ItemType');
const morgan = require('morgan');//Logs details of incoming HTTP requests for debugging and analytics.
const server = express();
const authMiddleware = require('./middlewares/authmiddle');
const checkRole = require('./middlewares/roleCheck');
const SubscriptionPlan=require('./routes/subscriptionPlanRoutes')
const UserSubscription=require('./routes/userSubscription');
const stripeWebhook = require('./webhooks/stripeWebhookHandler');
const addLaundry=require('./routes/addLaundry');
// ✅ 1. Stripe Webhook FIRST (before body parsers)
server.use('/api/v1/webhook', stripeWebhook);  // Must use express.raw()

// Middleware
server.use(cors());
server.use(express.json());
server.use(helmet());
server.use(cookieParser());
server.use(morgan('dev'));
server.use(express.urlencoded({extended:true}));

// Connect to MongoDB
main().catch(err => console.log(err));
async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/laundry');
  console.log('Connected to MongoDB');
}

// Routes
server.use('/api/v1/clients', clientRouter);
server.use('/api/v1/payments-method', paymentRoutes);
server.use('/api/v1/delivery-persons', deliveryPersonRoutes);
server.use('/api/v1',signUpRoutes);
server.use('/api/v1/business-type',authMiddleware, checkRole('admin', 'delivery'), businessType)
server.use('/api/v1/items-type',authMiddleware, checkRole('admin', 'delivery'), Itemtype)
server.use('/api/v1/subscription-plans',SubscriptionPlan)
server.use('/api/v1/user-subscription',UserSubscription)
server.use('/api/v1/order',addLaundry)


server.listen(8080, () => {
  console.log('Server is running on http://localhost:8080');
});
