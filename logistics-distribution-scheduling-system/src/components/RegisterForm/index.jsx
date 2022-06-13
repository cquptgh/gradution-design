import React, { useRef } from 'react'
import { Form, Input, Button, Row, Col } from 'antd'
import { UserOutlined, LockOutlined, VerifiedOutlined } from '@ant-design/icons'
import { reqRegister } from '@/api'

export default function LoginRegister() {
  const captchaRef = useRef()
  const { Item } = Form

  const onFinish = async values => {
    const { username, password, captcha } = values
    generateImageCode()
    await reqRegister(username, password, captcha)
  }

  //刷新验证码
  const generateImageCode = () => {
    const image_url = `api/passport/image_code/${Math.random()}`
    captchaRef.current.src = image_url
  }

  return (
    <Form name="normal_register" onFinish={onFinish}>
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
      <Item
        name="confirm"
        dependencies={['password']}
        hasFeedback
        rules={[
          {
            required: true,
            message: '请确认你的密码!'
          },
          ({ getFieldValue }) => ({
            validator(_, value) {
              if (!value || getFieldValue('password') === value) {
                return Promise.resolve()
              }
              return Promise.reject(new Error('两次输入的密码不一致!'))
            }
          })
        ]}
      >
        <Input.Password
          prefix={<LockOutlined className="site-form-item-icon" />}
          placeholder="Confirm"
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
        <Button type="primary" htmlType="submit">
          注册
        </Button>
      </Item>
    </Form>
  )
}
