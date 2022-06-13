import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { connect } from 'react-redux'
import { Table, Button, Modal, Radio, Space, InputNumber } from 'antd'
import {
  ExclamationCircleOutlined,
  PlayCircleOutlined,
  FundViewOutlined,
  DownloadOutlined,
  DeleteOutlined,
  SelectOutlined
} from '@ant-design/icons'
import {
  reqDeleteProject,
  reqDownLoadFile,
  reqInvokerExecutor,
  reqUpdateState,
  reqUpdateVehicleNumber
} from '@/api'
import { delProject, updateProjectState } from '@/redux/actions/projectList'
import { exportExcel } from '@/utils'
import './index.css'

function ProjectShow(props) {
  const [isModalVisible, setIsModalVisible] = useState(false)
  const [radioValue, setRadioValue] = useState(1)
  const [vehicleNumber, setVehicleNumber] = useState(1)
  const [projectId, setProjectId] = useState('')
  const [loadingState, setLoadingState] = useState({
    project_id: undefined,
    loading: false
  })
  const navigate = useNavigate()
  const { projectList, delProject, updateProjectState } = props

  const handleOk = () => {
    setIsModalVisible(false)
    updateProjectState(projectId, 2)
    reqUpdateState(2, projectId)
    reqUpdateVehicleNumber(vehicleNumber, projectId)
  }

  const invokeExecutor = async project_id => {
    setLoadingState({ project_id, loading: true })
    let result = await reqInvokerExecutor(project_id, vehicleNumber)
    if (result.status === 0) setLoadingState({ project_id, loading: false })
    updateProjectState(project_id, 3)
    reqUpdateState(3, project_id)
  }

  const downloadFile = async project_id => {
    let result = await reqDownLoadFile(project_id)
    let sheetFilter = ['name', 'longitude', 'latitude']
    let sheetHeader = ['服务点名称', '经度', '纬度']
    let datas = []
    result.data.forEach((item, index) => {
      datas.push({
        sheetData: item.route,
        sheetName: `车辆${index + 1}`,
        sheetFilter,
        sheetHeader
      })
    })
    const option = {
      fileName: '解决方案',
      datas
    }
    exportExcel(option)
  }

  const deleteProject = project_id => {
    const { confirm } = Modal
    confirm({
      title: '确定删除该项目吗?',
      icon: <ExclamationCircleOutlined />,
      okText: '确定',
      okType: 'danger',
      cancelText: '取消',
      async onOk() {
        //删除状态中的该项目,页面更新
        delProject(project_id)
        //删除数据库中的该项目
        await reqDeleteProject(project_id)
      }
    })
  }

  const columns = [
    {
      title: '项目名称(数据准备)',
      render: (text, record) => (
        <Link
          to={`/project-preparation/${record.project_id}`}
          className="edit-btn"
        >
          {record.project_name}
        </Link>
      )
    },
    {
      title: '选择方案',
      render: (text, record) => (
        <Button
          onClick={() => {
            setIsModalVisible(true)
            setProjectId(record.project_id)
          }}
          disabled={record.project_state > 0 ? false : true}
          icon={<SelectOutlined />}
          className="edit-btn"
        >
          方案选择
        </Button>
      )
    },
    {
      title: '执行算法',
      render: (text, record) => (
        <Button
          onClick={() => invokeExecutor(record.project_id)}
          disabled={record.project_state > 1 ? false : true}
          loading={
            record.project_id === loadingState.project_id
              ? loadingState.loading
              : false
          }
          icon={<PlayCircleOutlined />}
          className="edit-btn"
        >
          执行算法
        </Button>
      )
    },
    {
      title: '规划结果演示',
      render: (text, record) => (
        <Button
          onClick={() => navigate(`/demonstration/${record.project_id}`)}
          disabled={record.project_state > 2 ? false : true}
          icon={<FundViewOutlined />}
          className="edit-btn"
        >
          演示
        </Button>
      )
    },
    {
      title: '方案下载',
      render: (text, record) => (
        <Button
          onClick={() => downloadFile(record.project_id)}
          disabled={record.project_state > 2 ? false : true}
          icon={<DownloadOutlined />}
          className="edit-btn"
        >
          下载
        </Button>
      )
    },
    {
      title: '删除项目',
      render: (text, record) => (
        <Button
          icon={<DeleteOutlined />}
          onClick={() => deleteProject(record.project_id)}
          className="delete-btn"
        >
          删除
        </Button>
      )
    }
  ]

  return (
    <>
      <Table
        rowKey={record => record.project_id}
        columns={columns}
        dataSource={projectList}
        pagination={{ pageSize: 3 }}
        className="site-layout-background"
      />
      <Modal
        title="配送方案选择"
        visible={isModalVisible}
        okText="确定"
        cancelText="取消"
        onOk={handleOk}
        onCancel={() => setIsModalVisible(false)}
      >
        <Radio.Group
          onChange={e => {
            setRadioValue(e.target.value)
            setVehicleNumber(e.target.value)
          }}
          value={radioValue}
        >
          <Space direction="vertical">
            <Radio value={1}>单车辆配送</Radio>
            <Radio value={2}>
              多车辆配送
              <InputNumber
                disabled={radioValue === 2 ? false : true}
                min={2}
                max={4}
                defaultValue={2}
                className="vehicle_number"
                onChange={value => setVehicleNumber(value)}
              />
            </Radio>
          </Space>
        </Radio.Group>
      </Modal>
    </>
  )
}

export default connect(state => ({ projectList: state.projectList }), {
  delProject,
  updateProjectState
})(ProjectShow)
