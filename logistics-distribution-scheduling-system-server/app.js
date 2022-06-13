const express = require('express')
const AppConfig = require('./config')
const dataSource = require('./app-data-source')

const app = express()
let appConfig = new AppConfig(app)

dataSource
  .initialize()
  .then(() => {
    console.log('Data Source has been initialized!')
  })
  .catch(err => {
    console.error('Error during Data Source initialization:', err)
  })

app.listen(appConfig.listenPort, () => {
  console.log(`服务器已启动,${appConfig.listenPort}监听中`)
})
