const mongoose = require('mongoose')
const {Schema,model} = mongoose

const pollSchema = new Schema({ 
    name: String,
    email: String,
    password: String,
    registrationDate:{
        type: Date,
        default: new Date()
    },
    pollsCreated : [Schema.Types.ObjectId]
},{timestamps: true})

const User = model('User',pollSchema)
module.exports = User
