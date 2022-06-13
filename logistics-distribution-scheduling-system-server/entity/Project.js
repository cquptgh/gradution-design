const { EntitySchema } = require('typeorm')

module.exports = new EntitySchema({
  name: 'Project',
  tableName: 'projects',
  columns: {
    project_id: {
      primary: true,
      type: 'varchar',
      length: 21
    },
    project_name: {
      type: 'varchar',
      length: 50
    },
    username: {
      type: 'varchar',
      length: 20
    },
    project_state: {
      type: 'tinyint',
      default: 0
    },
    vehicle_number: {
      type: 'tinyint',
      default: 1
    },
    is_delete: {
      type: 'char',
      default: 'N'
    }
  }
})
