const { EntitySchema } = require('typeorm')

module.exports = new EntitySchema({
  name: 'Route',
  tableName: 'routes',
  columns: {
    id: {
      primary: true,
      type: 'int',
      generated: true
    },
    route: {
      type: 'json'
    },
    project_id: {
      type: 'varchar',
      length: 21
    }
  }
})
