const Candidate = require('../db/models/candidate')

const auth = async (req,res,next)=>{
    try{
        const candidate = await Candidate.findOne({email:req.body.email})
        if(!candidate)
            throw new Error('candidate not found!')
        req.candidate = candidate
        next()
    }catch(e){
        res.status(401).send({error:e.message})
    }
}

module.exports = auth