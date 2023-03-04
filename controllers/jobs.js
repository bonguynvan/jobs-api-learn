const { StatusCodes } = require('http-status-codes')
const { BadRequestError, NotFoundError } = require('../errors')
const Job = require('../models/Job')
const getAllJobs = async (req, res, next) => {
  const userId = req.user.userId
  const jobs = await Job.find({ createdBy: userId })
  res.status(StatusCodes.OK).json({ jobs, count: jobs.length })
}

const getJob = async (req, res, next) => {
  const {
    user: { userId },
    params: { id: jobId },
  } = req
  console.log(req.user)
  const job = await Job.findOne({ _id: jobId, createdBy: userId })
  if (!job) throw new NotFoundError(`Not found the job with id ${jobId}`)
  res.status(StatusCodes.OK).json(job)
}

const updateJob = async (req, res, next) => {
  const {
    user: { userId },
    body: { company, position },
    params: { id: jobId },
  } = req
  if (company === '' || position === '')
    throw new BadRequestError('Company and Position cannot empty')
  const job = await Job.findByIdAndUpdate(
    jobId,
    {
      createdBy: userId,
      ...req.body,
    },
    {
      new: true,
      runValidators: true,
    }
  )
  if (!job) throw new NotFoundError(`Not found the job with id ${jobId}`)
  res.status(StatusCodes.OK).json({ msg: 'Updated Job' })
}

const deleteJob = async (req, res, next) => {
  const {
    user: { userId },
    params: { id: jobId },
  } = req
  const job = await Job.findByIdAndDelete(jobId, { createdBy: userId })
  if (!job) throw new NotFoundError(`Not found the job with id ${jobId}`)
  res.status(StatusCodes.OK).json({ msg: 'Delete Sucess' })
}

const createJob = async (req, res, next) => {
  const { userId } = req.user
  console.log(userId)
  const job = await Job.create({ ...req.body, createdBy: userId })
  if (!job) throw new BadRequestError('Bad request')
  res.status(StatusCodes.CREATED).json({ job })
}

module.exports = {
  getAllJobs,
  getJob,
  createJob,
  updateJob,
  deleteJob,
}
