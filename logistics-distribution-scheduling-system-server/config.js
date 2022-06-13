const express = require('express')
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const cookieSession = require('cookie-session')
const path = require('path')
const keys = require('./keys')
// 引入注册路由的函数
const routes = require('./routes')

// 以面向对象的方式来抽取
class AppConfig {
  constructor(app) {
    this.app = app
    this.listenPort = 5000
    // 获取post请求参数的配置
    this.app.use(bodyParser.urlencoded({ extended: false }))
    this.app.use(express.static(path.resolve(__dirname, './public')))
    this.app.use(bodyParser.json())
    this.app.use(cookieParser())
    this.app.use(
      cookieSession({
        name: 'my_session',
        keys: [keys.session_key],
        maxAge: 1000 * 60 * 60 * 24 * 2 // 2天
      })
    )
    // 注册路由到app下
    routes(app)
  }
}

module.exports = AppConfig
