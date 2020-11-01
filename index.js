const express = require('express')
const debug = require('debug')('ecolier')
const cors = require('cors')
const { MongoClient } = require('mongodb')

var database = {}

const app = express()
app.use(cors())

app.get('/featured', async (req, res, next) => {
    const featured = await database.collection('featured').find({}).toArray()
    console.log(featured)
    res.send(featured)
})

new MongoClient('mongodb://localhost:27017', { useUnifiedTopology: true }).connect().then((databaseClient) => {
    database = databaseClient.db('ecolier')
    app.listen(5001, () => {
        debug('Listening on port 5001')
    })
})
