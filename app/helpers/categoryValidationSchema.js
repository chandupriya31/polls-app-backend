const Category = require("../models/categorymodel")


const catSchema = {
    notEmpty:{
        errorMessage: 'Category cannot be empty'
    },
    custom:{
        options:async(value)=>{
            const catObj = await Category.findOne({category:{'$regex':value,$options:'i'}})
            if(!catObj){
                return true
            }else{
                throw new Error('category already present')
            }
        }
    }
}

const categoryValidationSchema = {
    category:catSchema
}

module.exports = categoryValidationSchema