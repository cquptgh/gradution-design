const express = require('express')
const md5 = require('md5')
const Captcha = require('../utils/captcha')
const keys = require('../keys')
const { userRepository } = require('../entity/repository')

const router = express.Router()

router.get('/passport/image_code/:float', (req, res) => {
  let captchaObj = new Captcha()
  let captcha = captchaObj.getCode()
  // 保存图片验证码文本到session中
  req.session['ImageCode'] = captcha.text
  // 图片,<img src="路径" alt=""/>
  res.setHeader('Content-Type', 'image/svg+xml')
  res.send(captcha.data)
})

router.post('/register', async (req, res) => {
  // 1、获取post参数
  let { username, captcha, password } = req.body

  // 2、验证用户输入的图片验证码是否正确,不正确就return
  // 拿着用户填写的captcha和session中的req.session["ImageCode"]进行对比
  if (captcha.toLowerCase() !== req.session['ImageCode'].toLowerCase()) {
    res.send({ status: 1, errMsg: '验证码填写错误' })
    return
  }
  // 3、查询数据库,看看用户名是不是被注册了
  let result = await userRepository.findOne({ where: { username } })

  // 4、如果已经存在,返回用户名已经被注册,并return
  if (result) {
    res.send({ status: 1, errMsg: '用户名已经被注册' })
    return
  }
  // 5、不存在,就在数据库中新增加一条记录
  await userRepository.insert({
    username,
    password: md5(md5(password) + keys.password_salt),
    last_login: new Date().toLocaleString()
  })

  // 6、返回注册成功给前端
  res.send({ status: 0, successMsg: '注册成功' })
})

router.post('/login', async (req, res) => {
  //1、获取post请求参数,判空
  let { username, password, captcha } = req.body
  // 2、验证用户输入的图片验证码是否正确,不正确就return
  // 拿着用户填写的captcha和session中的req.session["ImageCode"]进行对比
  if (captcha.toLowerCase() !== req.session['ImageCode'].toLowerCase()) {
    res.send({ status: 1, errMsg: '验证码填写错误' })
    return
  }
  //3、查询数据库,验证用户名是不是已经注册了
  let result = await userRepository.findOne({ where: { username } })
  // result可能出现的两种情况：[{...}]    [ ]
  //4、如果没有注册,返回用户名未注册,return
  if (!result) {
    res.send({ status: 1, errMsg: '用户名未注册,登录失败' })
    return
  }

  //5、校验密码是不是正确？如果不正确,就return
  if (md5(md5(password) + keys.password_salt) !== result.password) {
    res.send({ status: 1, errMsg: '密码不正确,登录失败' })
    return
  }
  //6、保持用户登录状态
  req.session['user_id'] = result.user_id
  //设置最后一次登录时间 last_login字段
  //本质是在修改字段
  await userRepository.update(
    { user_id: result.user_id },
    { last_login: new Date().toLocaleString() }
  )
  //7、返回登录成功给前端
  res.send({ status: 0, successMsg: '登录成功' })
})

module.exports = router
