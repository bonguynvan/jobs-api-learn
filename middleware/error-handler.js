const { StatusCodes } = require('http-status-codes')
const { CustomAPIError } = require('../errors')

const errorHandlerMiddleware = async (err, req, res, next) => {
  const custom_error = {
    statusCode: err.statusCode || 500,
    message: err.message || 'Somthing went wrong! Please try again.',
  }
  // if (err instanceof CustomAPIError) {
  //   return res.status(err.statusCode).json({ msg: err.message })
  // }
  if (err.name === 'ValidationError') {
    custom_error.statusCode = 400
    custom_error.message = Object.values(err.errors)
      .map((item) => item.message)
      .join(', ')
  }

  if(err.name === 'CastError') {
    custom_error.statusCode = 404
    custom_error.message = `No item found with id ${err.value} `
  }
  if (err.code && err.code === 11000) {
    custom_error.message = `Duplicate entered for ${Object.keys(
      err.keyValue
    )}, please choose another value!`
    custom_error.statusCode = 400
  }
  return res.status(custom_error.statusCode).json({ msg: custom_error.message })
  return res.status(custom_error.statusCode).json({ msg: err })
}

module.exports = errorHandlerMiddleware
