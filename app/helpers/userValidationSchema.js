const User = require('../models/users-model')
const nameSchema =  {
    notEmpty:{
        errorMessage: 'Name should not be empty'
    },
    isLength:{
        options: {min:3,max:20},
        errorMessage: 'User Name should be b/w 3-20 chars'
    }
}

const emailSchema = {
    notEmpty:{
        errorMessage: 'Email should not be empty'
    },
    isEmail: {
        errorMessage: 'Invalid Email'
    },
    custom:{
        options:async(value)=>{
            const user = await User.findOne({email:value})
            if(!user){
                return true
            }else{
                throw new Error('User record already exists')
            }
        }
    }
}

const mypasswordSchema = {
    notEmpty:{
        errorMessage: 'Password should not be empty'
    },
    isLength:{
        options:{min: 7, max: 150},
        errorMessage: 'Password should be between 7-150 chars'
    }
}

const userRegisterationSchema = {
    name: nameSchema,
    email: emailSchema,
    password: mypasswordSchema
}

const userLoginSchema = {
    email: {
        notEmpty:{
            errorMessage: 'Email cannot be empty'
        },
        isEmail:{
            errorMessage: 'Invalid Email'
        }
    },
    password: mypasswordSchema
}

module.exports = {
    userRegisterationSchema,
    userLoginSchema
}