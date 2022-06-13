const { EntitySchema } = require('typeorm')

module.exports = new EntitySchema({
  name: 'Point',
  tableName: 'points',
  columns: {
    id: {
      primary: true,
      type: 'varchar',
      length: 21
    },
    name: {
      type: 'varchar',
      length: 100
    },
    address: {
      type: 'varchar',
      length: 100
    },
    longitude: {
      type: 'float'
    },
    latitude: {
      type: 'float'
    },
    is_center: {
      type: 'tinyint'
    },
    project_id: {
      type: 'varchar',
      length: 21
    }
  }
})
