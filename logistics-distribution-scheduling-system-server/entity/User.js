const { EntitySchema } = require('typeorm')

module.exports = new EntitySchema({
  name: 'User',
  tableName: 'users',
  columns: {
    user_id: {
      primary: true,
      type: 'int',
      generated: true
    },
    username: {
      type: 'varchar',
      length: 20
    },
    password: {
      type: 'varchar',
      length: 32
    },
    last_login: {
      type: 'varchar',
      length: 50,
      nullable: true
    }
  }
})
