const { validationResult } = require('express-validator')
const _ = require('lodash')
const Category = require('../models/categorymodel')

const catCtlr = {}

catCtlr.create = async(req,res)=>{
    const errors = validationResult(req)
    if(!errors.isEmpty()){
        return res.status(400).json({errors:errors.array()})
    }
    const body = _.pick(req.body,['category'])
    try{
        const cat = new Category(body)
        await cat.save()
        res.json(cat)
    }catch(err){
        res.status(500).json(err)
    }
}

catCtlr.list = async(req,res)=>{
    try{
        const categories = await Category.find()
        res.json(categories)
    }catch(e){
        res.status(500).json(err)
    }
}

module.exports = catCtlr

// skinny controller