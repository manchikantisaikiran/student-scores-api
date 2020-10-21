const mongoose = require('mongoose')

const candidateSchema = mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true,
        unique:true,
        trim:true,
        lowecase:true
    }
})

const Candidate = mongoose.model('candidate',candidateSchema)

module.exports = Candidate