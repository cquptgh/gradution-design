const svgCaptcha = require('svg-captcha')
class Captcha {
  getCode() {
    const captcha = svgCaptcha.create({
      inverse: false, // 翻转颜色
      color: true,
      background: '#bfbfbf',
      fontSize: 32, // 字体大小
      noise: 0, // 噪声线条数
      width: 100, // 宽度
      height: 32, // 高度
      size: 4, // 验证码长度
      ignoreChars: '0o1il' // 验证码字符中排除 0o1i
    })
    return captcha
  }
}

module.exports = Captcha
