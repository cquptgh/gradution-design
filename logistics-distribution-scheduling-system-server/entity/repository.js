const dataSource = require('../app-data-source')
const User = require('./User')
const Project = require('./Project')
const Point = require('./Point')
const Route = require('./Route')

const userRepository = dataSource.getRepository(User)
const projectRepository = dataSource.getRepository(Project)
const pointRepository = dataSource.getRepository(Point)
const routeRepository = dataSource.getRepository(Route)

module.exports = {
  userRepository,
  projectRepository,
  pointRepository,
  routeRepository
}
