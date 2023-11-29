const {validationResult, body} = require('express-validator')
const _ = require('lodash')
const bcrypt = require('bcryptjs')
const User = require('../models/users-model')
const jwt = require('jsonwebtoken')

const userCtlr = {}

userCtlr.register = async function(req,res){
    try{
        const errors = validationResult(req)
        if(!errors.isEmpty()){
            res.status(400).json({errors:errors.array()})
        }else{
            const body = _.pick(req.body,['name','email','password'])
            const user = new User(body)
            const salt = await bcrypt.genSalt()
            user.password = await bcrypt.hash(user.password,salt)
            const userData = await user.save()
            res.json({user: userData,message: 'User Registered Successfully'})
        }
    }catch(e){
        res.json(e)
    }
}

userCtlr.login = async(req,res)=>{
    try{
        const errors = validationResult(req)
        if(!errors.isEmpty()){
            res.status(400).json({errors:errors.array()})
        }else{
            const body = _.pick(req.body, ['email','password'])
            const user = await User.findOne({email: body.email})
            if(user){
                const result= await bcrypt.compare(body.password,user.password)
                if(result){
                    const tokenData = {
                        id: user._id
                    }
                    const token = jwt.sign(
                        tokenData,
                        process.env.JWT_SECRET,
                        {expiresIn: '7d'}
                    )
                    res.json({token:`Bearer ${token}`,message: 'Welcome'})
                }else{
                    res.status(404).json({errors:[{msg:'Invalid email/password'}]})
                }
            }else{
                res.status(404).json({errors:[{msg:'Invalid email/password'}]})
            }
        }
    }catch(e){
        res.json(e)
    }
}

userCtlr.account = async(req,res)=>{
    try{
        const user = await User.findById(req.user.id)
        res.json(user)
    }catch(e){
        res.status(500).json({errors:'something went wrong'})
    }
}

module.exports = userCtlr