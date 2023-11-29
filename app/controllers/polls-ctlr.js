const { validationResult } = require('express-validator')
const _ = require('lodash')
const Poll = require('../models/polls-model')
const User = require('../models/users-model')
const Category = require('../models/categorymodel')

const pollCtlr = {}

pollCtlr.create = async(req,res)=>{
    const errors = validationResult(req)
    if(!errors.isEmpty()){
        return res.status(400).json({errors:errors.array()})
    }
    const body = req.body
    const poll = new Poll(body)
    poll.creator = req.user.id
    try{
        await poll.save()
        await User.findOneAndUpdate({_id:poll.creator},{$push:{pollsCreated:poll._id}})
        res.json(poll)
    }catch(e){
        res.status(500).json(e)
    }
}

pollCtlr.mypolls = async(req,res)=>{
    try{
        const polls = await Poll.find({creator:req.user.id}).populate("categoryId").populate('creator',['name','_id'])
        res.json(polls)
    }catch(e){
        res.status(500).json(e)
    }
}

pollCtlr.active = async(req,res)=>{
    const today = new Date()
    const year = today.getFullYear(), month = today.getMonth()+1 , date = today.getDate()
    try{
        const activePolls = await Poll.find({endDate:{$gte: `${year}-${month}-${date}`}}).populate("categoryId").populate('creator',['name','_id'])
        res.json(activePolls)
    }catch(e){
        res.status(500).json(e)
    }
}

pollCtlr.category = async(req,res)=>{
    const name = req.params.name
    try{
        const cat = await Category.findOne({category:name})
        if(cat){
            const polls = await Poll.find({categoryId:cat._id})
            res.json(polls)
        }else{
            res.status(404).json(e)
        }
    }catch(e){
        res.status(500).json(e)
    }
}

module.exports = pollCtlr