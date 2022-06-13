import React, { useState, useEffect, useRef } from 'react'
import { useNavigate, Navigate } from 'react-router-dom'
import { Layout, Button, Popover, Avatar, Divider } from 'antd'
import { UserOutlined, PlusOutlined } from '@ant-design/icons'
import { connect } from 'react-redux'
import { nanoid } from 'nanoid'
import { uploadProjectList, addProject } from '@/redux/actions/projectList'
import { reqCreateProject, reqProjectList } from '@/api'
import CollectionCreateForm from '@/components/CollectionCreateForm'
import ProjectShow from '@/components/ProjectShow'
import './index.css'
import { formateDate } from '@/utils'
import { memoryUtils } from '@/utils'
import { operationUserStorage } from '@/utils'

function ProjectManage(props) {
  const [visible, setVisible] = useState(false)
  const [currentTime, setCurrentTime] = useState(formateDate(Date.now()))
  const navigate = useNavigate()
  const { uploadProjectList, addProject } = props
  const { Header, Content, Footer } = Layout
  const { user } = memoryUtils
  let intervalId = useRef(null)

  useEffect(() => {
    ;(async function () {
      let response = await reqProjectList(user.username)
      uploadProjectList(response.data)
    })()
  }, [user, uploadProjectList])

  useEffect(() => {
    intervalId.current = setInterval(() => {
      const currentTime = formateDate(Date.now())
      setCurrentTime(currentTime)
    }, 1000)
    return () => {
      clearInterval(intervalId.current)
    }
  }, [])

  //填写项目名称后点击Create按钮发起请求创建一个项目
  const onCreate = async values => {
    const { project_name } = values
    const project_id = nanoid()
    await reqCreateProject(project_id, project_name, user.username)
    addProject({ project_id, project_name, project_state: 0 })
    setVisible(false)
  }

  const logout = () => {
    operationUserStorage.removeUser()
    memoryUtils.user = {}
    navigate('/home')
  }

  const popoverContent = (
    <div>
      <p>
        Signed in as{' '}
        <span style={{ color: 'black', fontWeight: 'bold' }}>
          {user.username}
        </span>
      </p>
      <Divider style={{ margin: '2px' }} />
      <Button onClick={logout} style={{ border: 'none', width: '100%' }}>
        Sign out
      </Button>
    </div>
  )

  return !user.username ? (
    <Navigate to="/home" />
  ) : (
    <Layout>
      <Header className="header-layout">
        <div className="logo">物流配送调度系统</div>
        <div className="avatar">
          <Popover
            content={popoverContent}
            trigger="click"
            placement="bottomRight"
          >
            <Avatar shape="square" size="large" icon={<UserOutlined />} />
          </Popover>
        </div>
        <div className="time-info">{currentTime}</div>
      </Header>
      <Content className="site-layout">
        <Button
          type="primary"
          className="site-btn"
          onClick={() => {
            setVisible(true)
          }}
          icon={<PlusOutlined />}
        >
          创建项目
        </Button>
        <CollectionCreateForm
          visible={visible}
          onCreate={onCreate}
          onCancel={() => {
            setVisible(false)
          }}
        />
        <ProjectShow />
      </Content>
      <Footer style={{ textAlign: 'center' }}>欢迎使用</Footer>
    </Layout>
  )
}

export default connect(state => ({ projectList: state.projectList }), {
  uploadProjectList,
  addProject
})(ProjectManage)
