const express = require('express')
const { pointRepository } = require('../entity/repository')

const router = express.Router()

router.post('/insert-point', async (req, res) => {
  const { pointList, project_id } = req.body
  await pointRepository.delete({ project_id })
  pointList.forEach(async point => {
    let { key, name, address, latitude, longitude, is_center } = point
    await pointRepository.insert({
      id: key,
      name,
      address,
      latitude,
      longitude,
      is_center,
      project_id
    })
  })
  res.send({ status: 0, successMsg: '信息保存成功' })
})

router.get('/get-pointlist/:project_id', async (req, res) => {
  const { project_id } = req.params
  let result = await pointRepository.query(
    `select name,address,longitude,latitude,is_center from points where project_id="${project_id}"`
  )
  res.send({
    data: result
  })
})

module.exports = router
