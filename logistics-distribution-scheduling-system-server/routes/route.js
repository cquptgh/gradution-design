const express = require('express')
const { routeRepository } = require('../entity/repository')

const router = express.Router()

router.get('/get-route/:project_id', async (req, res) => {
  const { project_id } = req.params
  let result = await routeRepository.find({ where: { project_id } })
  result = result.map(item => ({ route: JSON.parse(item.route) }))
  res.send({
    data: result
  })
})

module.exports = router
