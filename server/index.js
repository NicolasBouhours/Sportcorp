// Main starting point of the application
const express = require('express')
const http  = require('http')
const bodyParser = require('body-parser')
const morgan = require('morgan')
const mongoose = require('mongoose')
const app = express()
const router = require('./router')

// Database Setup
if(process.env.NODE_ENV === 'test') {
  mongoose.connect('mongodb://localhost:test/test')
} else {
  mongoose.connect('mongodb://localhost:auth/auth')
  app.use(morgan('combined'))
}

// App Setup
app.use(bodyParser.json({ type: '*/*' }))
router(app)

// Server Setup
const port = process.env.port || 3090
const server = http.createServer(app)
server.listen(port)
console.log('Listening on port : ', port)

module.exports = server; // for testing
