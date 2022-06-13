import React, { useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { Form, Input, Button, Row, Col } from 'antd'
import { UserOutlined, LockOutlined, VerifiedOutlined } from '@ant-design/icons'
import { reqLogin } from '@/api'
import { memoryUtils } from '@/utils'
import { operationUserStorage } from '@/utils'

export default function Login() {
  const navigate = new useNavigate()
  const captchaRef = useRef()
  const { Item } = Form

  const onFinish = async values => {
    const { username, password, captcha } = values
    generateImageCode()
    let result = await reqLogin(username, password, captcha)
    if (result.status === 0) {
      memoryUtils.user = { username }
      operationUserStorage.saveUser({ username })
      navigate(`/project-manage?username=${username}`)
    }
  }

  //刷新验证码
  const generateImageCode = () => {
    const image_url = `api/passport/image_code/${Math.random()}`
    captchaRef.current.src = image_url
  }

  return (
    <Form name="normal_login" onFinish={onFinish}>
      <Item
        name="username"
        rules={[
          {
            type: 'string',
            required: true,
            message: '请输入用户名!'
          }
        ]}
      >
        <Input
          prefix={<UserOutlined className="site-form-item-icon" />}
          placeholder="Username"
        />
      </Item>
      <Item
        name="password"
        rules={[
          {
            type: 'string',
            required: true,
            message: '请输入密码!'
          }
        ]}
        hasFeedback
      >
        <Input.Password
          prefix={<LockOutlined className="site-form-item-icon" />}
          placeholder="Password"
        />
      </Item>
      <Item>
        <Row gutter={8}>
          <Col span={14}>
            <Form.Item
              name="captcha"
              noStyle
              rules={[
                {
                  required: true,
                  message: '请输入验证码!'
                }
              ]}
            >
              <Input
                prefix={<VerifiedOutlined className="site-form-item-icon" />}
                placeholder="验证码"
              />
            </Form.Item>
          </Col>
          <Col span={10}>
            <img
              src={`api/passport/image_code/${Math.random()}`}
              alt="captcha"
              className="captcha"
              onClick={generateImageCode}
              ref={captchaRef}
            />
          </Col>
        </Row>
      </Item>
      <Item>
        <Button type="primary" htmlType="submit" className="login-btn">
          登录
        </Button>
      </Item>
    </Form>
  )
}
