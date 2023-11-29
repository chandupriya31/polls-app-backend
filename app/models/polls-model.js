const mongoose = require('mongoose')
const {Schema,model} = mongoose

const pollSchema = new Schema({
    question: String,   
    creator:{
        type:String,
        ref: 'User'
    },
    options:[
        {
            optionText: String
        }
    ],
    endDate: Date,
    createdDate: Date,
    categoryId:{
        type:Schema.Types.ObjectId,
        ref:'Category'
    }
},{timestamps:true})

const Poll = model('Poll',pollSchema)
module.exports = Poll