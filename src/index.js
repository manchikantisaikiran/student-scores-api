const express = require('express')
require('./db/mongoose')

const route = require('./routes/route')

const app = express()
const port = 3000

app.use(express.json())
app.use(route)

app.listen(port, () => console.log('server is up and running'))