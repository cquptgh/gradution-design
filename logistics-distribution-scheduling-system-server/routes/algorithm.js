const express = require('express')
const exec = require('child_process').execSync
const readResult = require('../utils/readResult')
const router = express.Router()

router.post('/invoker-executor', async (req, res) => {
  const { project_id, vehicle_number } = req.body
  exec('LKH-3.exe parameter.txt', err => {
    console.log(err)
  })
  readResult(project_id, vehicle_number)
  res.send({ status: 0, successMsg: '算法执行完毕' })
})

module.exports = router

