import React, { useEffect, useState } from 'react'
import { Navigate, useParams, useNavigate } from 'react-router-dom'
import AMapLoader from '@amap/amap-jsapi-loader'
import {
  Button,
  Select,
  Drawer,
  Timeline,
  Tabs,
  notification,
  List
} from 'antd'
import { LeftOutlined, SmileOutlined } from '@ant-design/icons'
import { reqGetRoute } from '@/api/index'
import {
  memoryUtils,
  generateRouteLine,
  startAnimation,
  pauseAnimation,
  resumeAnimation,
  stopAnimation
} from '@/utils'
import './index.less'

export default function Demonstration() {
  const [map, setMap] = useState({})
  const [AMap, setAMap] = useState({})
  const [routes, setRoutes] = useState([{ route: [] }])
  const [carList, setCarList] = useState([])
  const [visible, setVisible] = useState(false)
  const { id: project_id } = useParams()
  const navigate = useNavigate()
  const {
    user: { username }
  } = memoryUtils
  const mapKey = 'a398b3200ead77701f6ba0abe9013b1a'
  const { Option } = Select
  const { TabPane } = Tabs

  useEffect(() => {
    AMapLoader.load({
      key: mapKey,
      version: '2.0',
      plugins: ['AMap.Driving', 'AMap.MoveAnimation']
    })
      .then(async AMap => {
        let newMap = new AMap.Map('container2', {
          resizeEnable: true,
          mapStyle: 'amap://styles/normal',
          viewMode: '3D',
          zoom: 13,
          center: [106.550464, 29.563761]
        })
        setAMap(AMap)
        setMap(newMap)
      })
      .catch(e => {
        console.log(e)
      })
  }, [])

  useEffect(() => {
    ;(async function () {
      let response = await reqGetRoute(project_id)
      setRoutes(response.data)
    })()
  }, [project_id])

  const openNotification = (value, routeDistance, costTime) => {
    notification.open({
      message: `第${value + 1}辆车路线信息`,
      description: `该条线路总长${routeDistance}公里,预计花费${costTime}小时`,
      icon: <SmileOutlined style={{ color: '#108ee9' }} />,
      duration: 0,
      placement: 'bottomLeft'
    })
  }

  const handleChange = async value => {
    let result = await generateRouteLine(routes[value].route, AMap, map, value)
    let carMarker = result[0].carMarker
    let lineArr = []
    result.map(item => lineArr.push(item.lineArr))
    lineArr = lineArr.flat()
    lineArr.pop()
    setCarList([
      ...carList,
      {
        value,
        start: () => startAnimation(carMarker, lineArr),
        pause: () => pauseAnimation(carMarker),
        resume: () => resumeAnimation(carMarker),
        stop: () => stopAnimation(carMarker)
      }
    ])
    let costTime = 0,
      routeDistance = 0
    result.forEach(item => {
      costTime += item.time
      routeDistance += item.distance
    })
    costTime = (costTime / 60 / 60).toFixed(2)
    routeDistance = (routeDistance / 1000).toFixed(2)
    openNotification(value, routeDistance, costTime)
  }

  const handleClear = () => {
    setCarList([])
    map.clearMap()
  }

  return !username ? (
    <Navigate to="/home" />
  ) : (
    <div className="demonstration-basic">
      <div id="container2" className="demonstration-map"></div>
      <div className="demonstration-nav">
        <Button
          type="primary"
          onClick={() => navigate(`/project-manage?username=${username}`)}
        >
          返回管理界面
        </Button>
        <Select
          onSelect={handleChange}
          onClear={handleClear}
          className="select-btn"
          placeholder="选择一辆车"
          allowClear
        >
          {routes.map((route, index) => (
            <Option value={index} key={index}>{`第${index + 1}辆车`}</Option>
          ))}
        </Select>
      </div>
      <List
        className="control-car"
        dataSource={carList}
        renderItem={item => (
          <List.Item>
            <div className="input-card">
              <h1>{`第${item.value + 1}辆车`}</h1>
              <Button onClick={item.start} className="start-btn">
                开始动画
              </Button>
              <Button onClick={item.pause} className="pause-btn">
                暂停动画
              </Button>
              <Button onClick={item.resume} className="resume-btn">
                继续动画
              </Button>
              <Button onClick={item.stop} className="stop-btn">
                停止动画
              </Button>
            </div>
          </List.Item>
        )}
      />
      <Button
        type="primary"
        icon={<LeftOutlined />}
        className="display-route-btn"
        onClick={() => setVisible(true)}
      ></Button>
      <Drawer
        title="路线展示"
        placement="right"
        width={400}
        onClose={() => setVisible(false)}
        visible={visible}
        closable={false}
      >
        <Tabs defaultActiveKey="0">
          {routes.map((routeObj, index) => (
            <TabPane tab={`第${index + 1}辆车`} key={index}>
              <Timeline>
                {routeObj.route.map((point, index) => (
                  <Timeline.Item key={index}>{point.name}</Timeline.Item>
                ))}
              </Timeline>
            </TabPane>
          ))}
        </Tabs>
      </Drawer>
    </div>
  )
}
