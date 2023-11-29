const Vote = require('../models/vote-model')
const {validationResult} = require('express-validator')

const voteCtlr = {}

voteCtlr.create = async(req,res)=>{
    const errors = validationResult(req)
    if(!errors.isEmpty()){
        return res.status(400).json({errors:errors.array()})
    }
    const body = req.body
    const pollId = req.params.pollId
    const vote = new Vote(body)
    vote.user = req.user.id
    vote.poll = pollId
    try{
        await vote.save()
        res.json(vote)
    }catch(e){
        res.status(500).json(e)
    }
}

voteCtlr.myVotes = async(req,res)=>{
    try{
        const result = await Vote.find({user:req.user.id})
        res.json(result)
    }catch(e){
        res.status(500).json(e)
    }
}

module.exports = voteCtlr