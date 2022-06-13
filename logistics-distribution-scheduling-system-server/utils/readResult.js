const { createReadStream } = require('fs')
const { resolve } = require('path')
const { pointRepository, routeRepository } = require('../entity/repository')

async function readResult(project_id, vehicle_number) {
  await routeRepository.delete({ project_id })
  // 获取指定项目的点的数据
  let center_point = await pointRepository.query(
    `select name,longitude,latitude from points where project_id="${project_id}" and is_center=1`
  )
  let server_points = await pointRepository.query(
    `select name,longitude,latitude from points where project_id="${project_id}" and is_center=0`
  )
  let pointList = [...center_point, ...server_points]
  const readResult = createReadStream(resolve(__dirname, '../result.txt'))
  let arr = []
  readResult.on('data', chunk => {
    arr.push(chunk)
  })
  readResult.on('end', async () => {
    let result = Buffer.concat(arr).toString()
    if (vehicle_number > 1) {
      result = result.split('\n').slice(2, -1)
      result = result.map(item => item.split(' ').slice(0, -4))
      result = result.map(item => item.map(value => Number.parseInt(value)))
      result.forEach(async route => {
        let temp = []
        route.forEach(value => {
          const { name, longitude, latitude } = pointList[value - 1]
          temp.push({ name, longitude, latitude })
        })
        await routeRepository.insert({
          route: JSON.stringify(temp),
          project_id
        })
      })
    } else {
      // 存储单车辆的路线
      let route = []
      result = result.split('\n').slice(6, -3)
      result = result.map(item => Number.parseInt(item.replace('\r', '')))
      result.push(1)
      result.forEach(value => {
        const { name, longitude, latitude } = pointList[value - 1]
        route.push({ name, longitude, latitude })
      })
      await routeRepository.insert({ route: JSON.stringify(route), project_id })
    }
  })
}
module.exports = readResult
