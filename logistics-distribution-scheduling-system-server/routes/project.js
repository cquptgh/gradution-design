const express = require('express')
const writeFile = require('../utils/writeFile')
const { projectRepository, pointRepository } = require('../entity/repository')

const router = express.Router()

router.get('/get-project/:username', async (req, res) => {
  const { username } = req.params
  let result = await projectRepository.query(
    `select project_id,project_name,project_state from projects where username="${username}" and is_delete='N'`
  )
  res.send({
    data: result
  })
})

router.post('/create-project', async (req, res) => {
  let { project_id, project_name, username } = req.body
  let findResult = await projectRepository.findOne({
    where: {
      project_name,
      username,
      is_delete: 'N'
    }
  })
  if (findResult) {
    res.send({ status: 1, errMsg: '该项目已存在' })
    return
  }
  await projectRepository.insert({
    project_id,
    project_name,
    username
  })
  res.send({ status: 0, successMsg: '项目创建成功' })
})

router.get('/delete-project/:project_id', async (req, res) => {
  const { project_id } = req.params
  await projectRepository.update({ project_id }, { is_delete: 'Y' })
  res.send({ status: 0, successMsg: '删除项目成功' })
})

router.put('/update-state', async (req, res) => {
  const { project_state, project_id } = req.body
  await projectRepository.update({ project_id }, { project_state })
})

router.put('/update-vehicle', async (req, res) => {
  const { vehicle_number, project_id } = req.body
  await projectRepository.update({ project_id }, { vehicle_number })
  let center_point = await pointRepository.query(
    `select longitude,latitude from points where project_id="${project_id}" and is_center=1`
  )
  let server_points = await pointRepository.query(
    `select longitude,latitude from points where project_id="${project_id}" and is_center=0`
  )
  let pointList = [...center_point, ...server_points]
  writeFile(pointList, vehicle_number)
  res.send({ status: 0, successMsg: '方案选择完毕' })
})

module.exports = router
