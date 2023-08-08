const express = require('express')
const cors = require('cors')
const mongoose = require('mongoose')
const dotenv = require('dotenv')
const exphbs = require('express-handlebars')
const methodOverride = require('method-override')
const cookieParser = require('cookie-parser')
const session = require('express-session')
const cron = require('node-cron')
const fileUpload = require('express-fileupload')

const connectDB = require('./config/db')
const updateValues = require('./scripts/updatePrinters')
const generateTable = require('./scripts/genTable')
const sendEmail = require('./scripts/sendEmail')
const generateReport = require('./scripts/generateReport')
const logger = require('./scripts/logger')

const config = require('./config/config')

// Load /config/env
dotenv.config({
    path: './config/.env'
})

// Define Express app
const app = express()

// Enable CORS
app.use(cors())

// Body parsing
app.use(express.urlencoded({
    extended: false
}))
app.use(express.json())

// File Upload
app.use(fileUpload())

// Flash messages
app.use(cookieParser('' + process.env.COOKIE_SECRET))
app.use(session({
    resave: true,
    saveUninitialized: true,
    secret: '' + process.env.SESSION_SECRET,
    cookie: { maxAge: 60000 }
}))

app.use((req, res, next) => {
    res.locals.message = req.session.message
    delete req.session.message
    next()
})

// Method Override
app.use(methodOverride(function (req, res) {
    if (req.body && typeof req.body === 'object' && '_method' in req.body) {
        const method = req.body._method
        delete req.body._method
        return method
    }
}))

// Connect to MongoDB
connectDB()

// Serve CSS from /public
// eslint-disable-next-line node/no-path-concat
app.use('/js', express.static(__dirname + '/node_modules/bootstrap/dist/js')) // redirect bootstrap JS
// eslint-disable-next-line node/no-path-concat
app.use('/js', express.static(__dirname + '/node_modules/jquery/dist')) // redirect JS jQuery
// eslint-disable-next-line node/no-path-concat
app.use('/css', express.static(__dirname + '/node_modules/bootstrap/dist/css')) // redirect CSS bootstrap
// eslint-disable-next-line node/no-path-concat
app.use('/icons', express.static(__dirname + '/node_modules/bootstrap-icons'))

// Enable handlebars
app.engine('.hbs', exphbs({
    defaultLayout: 'main',
    extname: '.hbs',
    helpers: {
        getPath (name) {
            if (name) {
                return '/static/' + name.replace(/ /g, '') + '.html'
            }
        }
    }
}))
app.set('view engine', '.hbs')

// Define route extensions
app.use('/', require('./routes/index'))
app.use('/groups', require('./routes/groups'))
app.use('/printers', require('./routes/printers'))
app.use('/users', require('./routes/users'))
app.use('/login', require('./routes/login'))

app.use('/static', express.static('public/tables'))

// Expose port
const port = config.port
app.listen(port, () => {
    logger.info(`Server hosted on port ${port}`)
})

// Update database values and create new tables every 3 minutes
logger.info('scheduling update and generation...')
cron.schedule('*/3 * * * *', async () => {
	logger.info('update triggering')
    await updateValues()
	console.log('finished')
    await generateTable()
}, {})

// Send emails every 3 hours
logger.info('scheduling emails...')
cron.schedule('0 */' + config.email_hours + ' * * *', async () => {
	logger.info('sendEmail triggering')
    sendEmail().catch(logger.error)
}, {})

logger.info('scheduling report...')
cron.schedule('0 0 * * 1', async () => {
	logger.info('report triggering')
    await generateReport()
})

console.log("Hello!");
