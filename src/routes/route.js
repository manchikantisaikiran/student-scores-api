const express = require('express')

const Candidate = require('../db/models/candidate')
const Score = require('../db/models/testScore')
const auth = require('../middlewear/auth')

const router = express.Router()

router.post('/candidate', async (req, res) => {
    const candidate = new Candidate(req.body)
    try {
        console.log(candidate)
        await candidate.save()
        res.send(candidate)
    } catch (e) {
        res.status(400).send({ error: e.message })
    }
})

router.post('/testScore', auth, async (req, res) => {
    const allowedUpdates = ['first_round', 'second_round', 'third_round']
    try {
        const student = await Score.findOne({ student: req.candidate._id })
        if (!student) {
            const testScores = new Score({
                student: req.candidate._id,
                ...req.body
            })
            await testScores.save()
            return res.send(testScores)
        }
        allowedUpdates.forEach(update => student[update] = req.body[update] || student[update])
        // student.first_round = req.body.first_round || student.first_round
        // student.second_round = req.body.second_round || student.second_round
        // student.third_round = req.body.third_round || student.third_round
        await student.save()
        res.send(student)
    } catch (e) {
        res.status(400).send()
    }
})

router.get('/average', async (req, res) => {
    let average = {
        avg_first: 0,
        avg_second: 0,
        avg_third: 0
    };
    let highestScore = 0;
    let array = []
    try {
        const scores = await Score.find({})
        scores.forEach(score => {
            array.push(score.first_round + score.second_round + score.third_round)
            average.avg_first += score.first_round
            average.avg_second += score.second_round
            average.avg_third += score.third_round
        })
        average.avg_first /= array.length;
        average.avg_second /= array.length;
        average.avg_third /= array.length;
        
        array.sort((a, b) => a - b)
        highestScore = array[array.length - 1]

        res.send({ highestScore, average })
    } catch (e) {
        res.status(400).send({ error: e.message })
    }
})

module.exports = router