const mongoose = require('mongoose')
const Schema = mongoose.Schema

const users_schema = new Schema({

    type:{
        type:String,
        required:true
    },
    
    name:{
        type:String,
        required:true
    }
},
{timestamps:true})

const Users = mongoose.model('user',users_schema)

module.exports ={
    Users:Users
}
