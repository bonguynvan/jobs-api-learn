require('dotenv').config()
require('express-async-errors')

const express = require('express')
const jobRouter = require('./routes/jobs')
const authRouter = require('./routes/auths')
const cors = require('cors')
const rateLimit = require('express-rate-limit')
const helmet = require('helmet')
const xss = require('xss-clean')
const app = express()
const authenticationMiddleware = require('./middleware/authentication')
// error handler
const notFoundMiddleware = require('./middleware/not-found')
const errorHandlerMiddleware = require('./middleware/error-handler')

app.use(express.json())
app.set('trust proxy', 1)
app.use(
  rateLimit({
    windowMs: 15 * 60 * 100,
    max: 100,
  })
)
app.use(helmet())
app.use(cors())
app.use(xss())
//extra packages

app.get('/', (req, res) => {
  res.send('job api')
})
app.use('/api/v1/auth', authRouter)
app.use('/api/v1/jobs', authenticationMiddleware, jobRouter)

// middleware
app.use(notFoundMiddleware)
app.use(errorHandlerMiddleware)
const PORT = process.env.PORT || 3000

const dbUrl = process.env.MONGO_URI
const connectDB = require('./db/connect')
const start = async () => {
  await connectDB(dbUrl)
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
  })
}

start()
