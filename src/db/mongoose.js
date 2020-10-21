const mongoose = require('mongoose')

mongoose.connect(process.env.MONGODBURL, { 
    useUnifiedTopology: true,
    useNewUrlParser: true,
    useCreateIndex:true
 })