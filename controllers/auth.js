const User = require('../models/User')
const { StatusCodes } = require('http-status-codes')
const { BadRequestError, UnauthenticatedError } = require('../errors')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const register = async (req, res) => {
  const user = await User.create({ ...req.body })
  console.log(user)
  res
    .status(StatusCodes.CREATED)
    .json({ userId: user._id, name: user.name, token: user.createJWT() })
}
const login = async (req, res) => {
  const { email, password } = req.body
  if (!email || !password) {
    throw new BadRequestError('Please provide email and password')
  }
  const user = await User.findOne({ email })
  if (!user) throw new UnauthenticatedError('Email not existed')
  const isMatch = await user.comparePassword(password)
  if (!isMatch) throw new UnauthenticatedError('Wrong password')
  res
    .status(StatusCodes.ACCEPTED)
    .json({ userId: user._id, name: user.name, msg: 'login success', token: user.createJWT() })
}

module.exports = {
  register,
  login,
}
