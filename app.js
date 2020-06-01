const express = require('express')
const session = require('express-session')
const MongoStore = require('connect-mongo')(session)
const flash = require('connect-flash')
const app = express()

let sessionOptions = session ({
    secret: 'Js is cool',
    store: new MongoStore({client: require('./db')}),
    resave: false,
    saveUninitialized: false,
    cookie: {maxAge: 1000*60*60*24, httpOnly: true}
})

app.use(sessionOptions)
app.use(flash())



app.set('views', 'views')
app.set('view engine','ejs')
app.use(express.static("public"))

app.use(express.urlencoded({extended: false}))
app.use(express.json())

const router = require('./router')

app.use('/',router)

module.exports = app