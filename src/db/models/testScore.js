const mongoose = require('mongoose')

const scoreSchema = mongoose.Schema({
    first_round:{
        type:Number,
        default:0,
        max:10
    },
    second_round:{
        type:Number,
        default:0,
        max:10
    },
    third_round:{
        type:Number,
        default:0,
        max:10
    },
    student:{
        type:mongoose.Schema.Types.ObjectId,
        required:true,
        ref:'candidate'
    }
})

const score = mongoose.model('score',scoreSchema)

module.exports = score
