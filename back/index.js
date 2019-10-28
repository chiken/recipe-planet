const cors = require('cors')
const express = require('express')
const mongoose = require('mongoose')
const morgan = require('morgan')

const app = express()

// CONFIG AND ENVIRONMENT LOADING FROM .env FILE
let config = require('./.env')
const environment = process.env.NODE_ENV
config = config[environment]
if (!config) {
  throw new Error(`❌ Invalid ${environment} environment`)
}

// MIDDLEWARES
app.use(cors())
app.use(morgan('combined'))
app.use(express.json())

// NONGOOSE
mongoose.connect(config.mongoURL + config.mongoDBName)

// ROUTING
const apiRouter = require('./app/routes')
const { login, signup } = require('./app/controllers/authController')

app.use('/api', apiRouter);
app.post('/login', login);
app.post('/signup', signup)


// Init server
app.listen(config.port, (err) => {
  if (err) { throw new Error(err) }
  console.info('\n\n' + '>'.repeat(40))
  console.info('💻  Reboot Server Live')
  console.info(`📡  PORT: http://localhost:${config.port}`)
  console.info('>'.repeat(40) + '\n\n')
})