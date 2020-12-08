const express = require('express')
const debug = require('debug')('ecolier')
const cors = require('cors')
const { MongoClient } = require('mongodb')

const environment = process.env.NODE_ENV ?? 'development'
if (environment === 'development') { require('dotenv').config({ path: '.env.dev' }) }
if (environment === 'production') {  require('dotenv').config({ path: '.env.prod' }) }

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
    const featured = await database.collection('articles').findOne({ locale: res.locals.locale, name: req.params.name })
    res.send(featured)
})

app.get('/:locale/products', async (req, res, next) => {
    const products = await database.collection('products').find({ locale: res.locals.locale }).toArray()
    res.send(products)
})

app.get('/:locale/product/:product', async (req, res, next) => {
    const name = req.params.product.charAt(0).toUpperCase() + req.params.product.slice(1)
    const product = await database.collection('products').findOne({ locale: res.locals.locale, name: name })
    res.send(product)
})

app.get('/:locale/developer', async (req, res, next) => {
    const developer = await database.collection('developer').find({
        $or: [{ id: 0}, { locale: req.params.locale }]
    }, { fields: { _id: 0, id: 0, locale: 0 }}).toArray()
    res.send(developer.reduce((i, t) => {
        return { ...i, ...t }
    }, { }))
})

new MongoClient(process.env.DATABASE, { useUnifiedTopology: true, useNewUrlParser: true }).connect().then((databaseClient) => {
    database = databaseClient.db('ecolier')
    app.listen(process.env.PORT, () => {
        debug(`Listening on port ${process.env.PORT}`)
    })
})
