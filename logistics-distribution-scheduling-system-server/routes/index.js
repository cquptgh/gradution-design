// 各个路由的汇总文件
// 引入各个路由对象
const projectRouter = require('./project')
const pointRouter = require('./point')
const algorithmRouter = require('./algorithm')
const passportRouter = require('./passport')
const routeRouter = require('./route')

module.exports = function (app) {
  app.use(passportRouter)
  app.use(projectRouter)
  app.use(pointRouter)
  app.use(algorithmRouter)
  app.use(routeRouter)
}
