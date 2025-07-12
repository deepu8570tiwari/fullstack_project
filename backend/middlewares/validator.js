const Joi=require('joi');

exports.signupschema=Joi.object({
    name: Joi.string().min(3).max(50).required(),
    email: Joi.string()
        .min(6)
        .max(60)
        .required()
        .email({
            tlds:{allow:['com','net']}
        }),
    password: Joi.string()
        .required()
        .pattern(new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&#])[A-Za-z\\d@$!%*?&#]{8,}$')).messages({
        'string.pattern.base':
        'Password must contain at least 8 characters, including uppercase, lowercase, number, and special character.',
        'string.empty': 'Password is required',
    }),
    business_type: Joi
        .string()
        .valid('admin', 'manager','salon', 'hospital', 'hotel','delivery','air-bnb','flat-owner').required(),
        business_name:Joi.when('business_type', {
        is: Joi.valid('salon', 'hospital', 'hotel'),  // For these roles, businessName is required
        then: Joi.string().min(2).max(100).required().messages({
            'any.required': 'Business name is required for clients',
            'string.empty': 'Business name cannot be empty',
        }),
        otherwise: Joi.string().allow('', null).default(null), // For admin, manager, support: businessName optional or empty
    }),
    business_phone: Joi.string().min(3).max(50),
    business_address: Joi.string().min(3).max(50),
    emergency_number: Joi.string().when('business_type', {
        is: 'delivery',
        then: Joi.string().required().messages({ 'any.required': 'Emergency number is required' }),
        otherwise: Joi.optional(),
    }),
   vehicle_type: Joi.string().when('business_type', {
        is: 'delivery',
        then: Joi.string().required().messages({
            'any.required': 'Vehicle type is required'
        }),
        otherwise: Joi.optional(),
    }),
    vehicle_number: Joi.string().when('business_type', {
        is: 'delivery',
        then: Joi.string().required().messages({ 'any.required': 'Vehicle number is required' }),
        otherwise: Joi.optional(),
    }),
    vehicle_model: Joi.string().when('business_type', {
        is: 'delivery',
        then: Joi.string().required().messages({ 'any.required': 'Vehicle Model is required' }),
        otherwise: Joi.optional(),
    }),
    vehicle_insurance_number: Joi.string().when('business_type', {
        is: 'delivery',
        then: Joi.string().required().messages({ 'any.required': 'vehicle insurance number is required' }),
        otherwise: Joi.optional(),
    }),
    driver_licence_number: Joi.string().when('business_type', {
        is: 'delivery',
        then: Joi.string().required().messages({ 'any.required': 'Driver Licence is required' }),
        otherwise: Joi.optional(),
    }),
    driver_licence_expiry: Joi.date().when('business_type', {
        is: 'delivery',
        then: Joi.date().required().messages({ 'any.required': 'Driver License expiry date is required' }),
        otherwise: Joi.optional(),
    }),
    driver_aadhar_card_number: Joi.string().when('business_type', {
        is: 'delivery',
        then: Joi.string().required().messages({ 'any.required': 'Driver Aadhar Card Number is required' }),
        otherwise: Joi.optional(),
    }),
    driver_pan_card_number: Joi.string().when('business_type', {
        is: 'delivery',
        then: Joi.string().required().messages({ 'any.required': 'Driver Pan Card Number is required' }),
        otherwise: Joi.optional(),
    }),
})


/*Singin Schema Section*/
exports.signInschema=Joi.object({
    email: Joi.string()
        .min(6)
        .max(60)
        .required()
        .email({
            tlds:{allow:['com','net']}
        }),
    password:Joi.string()
        .required()
        })
        
exports.acceptCodeschema=Joi.object({
    email: Joi.string()
        .min(6)
        .max(60)
        .required()
        .email({
            tlds:{allow:['com','net']}
        }),
    providedCode:Joi.number().required()
})
exports.changePasswordSchema=Joi.object({
    newPassword:Joi
    .string()
    .required(),
    oldPassword:Joi
    .string()
    .required()
})
exports.acceptforgetPasswordSchema=Joi.object({
   email: Joi.string()
        .min(6)
        .max(60)
        .required()
        .email({
            tlds:{allow:['com','net']}
        }),
    providedCode:Joi
    .number()
    .required(),
    newPassword:Joi
    .required()
})