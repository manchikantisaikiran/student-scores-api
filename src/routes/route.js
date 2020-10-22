const express = require('express')

const Candidate = require('../db/models/candidate')
const Score = require('../db/models/testScore')
const auth = require('../middlewear/auth')

const router = express.Router()

router.post('/insert/candidate', async (req, res) => {
    const candidate = new Candidate(req.body)
    try {
        await candidate.save()
        res.send("candidate inserted succesfully")
    } catch (e) {
        res.status(400).send({ error: e.message })
    }
})

router.post('/assign/marks', auth, async (req, res) => {
    const allowedUpdates = ['first_round', 'second_round', 'third_round']
    try {
        const student = await Score.findOne({ student: req.candidate._id })
        if (!student) {
            const testScores = new Score({
                student: req.candidate._id,
                ...req.body
            })
            await testScores.save()
            return res.send(`updated marks succesfully`)
        }
        allowedUpdates.forEach(update => student[update] = req.body[update] || student[update])

        await student.save()
        res.send(`updated marks succesfully`)
    } catch (e) {
        res.status(400).send()
    }
})

router.get('/average/marks', async (req, res) => {
    let average = {
        first_round: 0,
        second_round: 0,
        third_round: 0
    };

    let highestScoreCandidate = {
        highestScore: 0
    }
    let array = []
    try {
        const scores = await Score.find({})

        scores.forEach(score => {
            array.push(score.first_round + score.second_round + score.third_round)
            let totalScore = score.first_round + score.second_round + score.third_round

            if (highestScoreCandidate.highestScore < totalScore) {
                highestScoreCandidate.highestScore = totalScore
                highestScoreCandidate.student = score.student
                // highestScoreCandidate._id = score._id
            }

            average.first_round += score.first_round
            average.second_round += score.second_round
            average.third_round += score.third_round
        })
        average.first_round /= array.length;
        average.second_round /= array.length;
        average.third_round /= array.length;

        const studentId = await Score.findOne({ student: highestScoreCandidate.student })
        await studentId.populate('student').execPopulate()

        highestScoreCandidate.email = studentId.student.email
        highestScoreCandidate.name = studentId.name

        res.send({ highestScoreCandidate, average })
    } catch (e) {
        res.status(400).send({ error: e.message })
    }
})

module.exports = router