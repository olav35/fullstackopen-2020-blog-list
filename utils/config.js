require('dotenv').config()

const MONGODB_URI = process.env.NODE_ENV === 'test' ? process.env.TEST_MONGODB_URI : process.env.MONGODB_URI
// Slow internet needs increase timeout
const INTERNET_SPEED = process.env.INTERNET_SPEED || 'fast'

module.exports = {
  MONGODB_URI,
  PORT: process.env.PORT,
  SECRET: process.env.SECRET,
  INTERNET_SPEED
}