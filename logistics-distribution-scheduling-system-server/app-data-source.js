const { DataSource } = require('typeorm')

const dataSource = new DataSource({
  type: 'mysql',
  host: 'localhost',
  port: 3306,
  username: 'root',
  password: 'cquptgh',
  database: 'logistics-system',
  synchronize: true,
  entities: [
    require('./entity/User'),
    require('./entity/Project'),
    require('./entity/Point'),
    require('./entity/Route')
  ]
})

module.exports = dataSource
