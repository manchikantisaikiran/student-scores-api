const express = require('express')

const Candidate = require('../db/models/candidate')
const Score = require('../db/models/testScore')
const auth = require('../middlewear/auth')

const router = express.Router()

router.post('/insert/candidate', async (req, res) => {
    const candidate = new Candidate(req.body)
    try {
        await candidate.save()
        res.send(candidate)
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
            return res.send(testScores)
        }
        allowedUpdates.forEach(update => student[update] = req.body[update] || student[update])

        await student.save()
        res.send(student)
    } catch (e) {
        res.status(400).send()
    }
})

router.get('/average/marks', async (req, res) => {
    let average = {
        first: 0,
        second: 0,
        third: 0
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
                highestScoreCandidate._id = score._id
            }

            average.first += score.first_round
            average.second += score.second_round
            average.third += score.third_round
        })
        average.first /= array.length;
        average.second /= array.length;
        average.third /= array.length;

        const studentId = await Score.findOne({ student: highestScoreCandidate.student })
        await studentId.populate('student').execPopulate()

        highestScoreCandidate.email = id.student.email
        highestScoreCandidate.name = id.student.name


        res.send({ highestScoreCandidate, average })
    } catch (e) {
        res.status(400).send({ error: e.message })
    }
})

module.exports = router