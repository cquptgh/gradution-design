import React from 'react'
import { Tabs } from 'antd'
import { Navigate } from 'react-router-dom'
import { memoryUtils } from '@/utils'
import MyParticles from '@/components/MyParticles/index'
import LoginForm from '@/components/LoginForm'
import RegisterForm from '@/components/RegisterForm'
import './index.less'

export default function HomePage() {
  const { TabPane } = Tabs
  const {
    user: { username },
  } = memoryUtils
  return !!username ? (
    <Navigate to={`/project-manage?username=${username}`} />
  ) : (
    <div className="home-container">
      <MyParticles />
      <Tabs defaultActiveKey="login" className="form-content" centered={true}>
        <TabPane tab="登录" key="login">
          <LoginForm />
        </TabPane>
        <TabPane tab="注册" key="register">
          <RegisterForm />
        </TabPane>
      </Tabs>
    </div>
  )
}
