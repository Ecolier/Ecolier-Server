const express = require('express')
const debug = require('debug')('ecolier')
const cors = require('cors')
const { MongoClient } = require('mongodb')

var database = {}

const app = express()
app.use(cors())

app.use('/:locale', (req, res, next) => {
    res.locals.locale = req.params.locale
    next()
}) 

app.get('/:locale/featured', async (req, res, next) => {
    const featured = await database.collection('featured').find({ locale: res.locals.locale }).toArray()
    res.send(featured)
})

app.get('/:locale/article/:name', async (req, res, next) => {
    const featured = await database.collection('articles').find({ locale: res.locals.locale, name: req.params.name }).toArray()
    res.send(featured)
})

new MongoClient('mongodb://localhost:27017', { useUnifiedTopology: true }).connect().then((databaseClient) => {
    database = databaseClient.db('ecolier')
    app.listen(5001, () => {
        debug('Listening on port 5001')
    })
})
