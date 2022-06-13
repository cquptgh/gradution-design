import React, { useState, useEffect, useRef } from 'react'
import { useNavigate, Navigate } from 'react-router-dom'
import { Input, Button, Upload, message } from 'antd'
import { memoryUtils } from '@/utils'
import AMapLoader from '@amap/amap-jsapi-loader'
import { connect } from 'react-redux'
import { useParams } from 'react-router-dom'
import {
  UploadOutlined,
  DownloadOutlined,
  SaveOutlined,
  ArrowLeftOutlined,
} from '@ant-design/icons'
import * as XLSX from 'xlsx'
import { nanoid } from 'nanoid'
import { addPoint, uploadPointList } from '@/redux/actions/selectPoint'
import {
  processAMapData,
  createLabelsLayer,
  createLabelMarker,
  handleImpotedJson,
  exportExcel,
} from '@/utils'
import PointDisplay from '@/components/PointDisplay'
import { reqInsertPoint, reqPointList, reqUpdateState } from '@/api'
import mark_b from '@/assets/image/mark_b.png'
import './index.less'

function ProjectPreparation(props) {
  const navigate = useNavigate()
  const mapKey = 'a398b3200ead77701f6ba0abe9013b1a'
  const {
    user: { username },
  } = memoryUtils
  const [AMap, setAMap] = useState({})
  let map = useRef({})
  let labelsLayer = useRef({})
  const { Search } = Input
  const { id: project_id } = useParams()
  const { uploadPointList, addPoint } = props

  useEffect(() => {
    // 点击地图的回调
    const handleClick = (e, AMap, labelsLayer) => {
      const geocoder = new AMap.Geocoder({ radius: 1000 })
      const longitude = e.lnglat.getLng() //获得点击的经度
      const latitude = e.lnglat.getLat() //获得点击的维度
      let lnglat = [longitude, latitude]
      let marker
      marker = createLabelMarker(AMap, { longitude, latitude }, mark_b)
      geocoder.getAddress(lnglat, (status, result) => {
        if (status === 'complete' && result.regeocode) {
          //将选取的点存入redux管理状态中
          addPoint({
            key: nanoid(),
            name: result.regeocode.formattedAddress,
            address: result.regeocode.formattedAddress,
            longitude,
            latitude,
            is_center: 0,
            marker,
          })
        } else {
          console.log('根据经纬度查询地址失败')
        }
      })
      labelsLayer.add(marker)
    }

    AMapLoader.load({
      key: mapKey,
      version: '2.0',
      plugins: ['AMap.Geocoder', 'AMap.PlaceSearch', 'AMap.InfoWindow'],
    })
      .then(async AMap => {
        map.current = new AMap.Map('container', {
          resizeEnable: true,
          mapStyle: 'amap://styles/normal',
          viewMode: '3D',
          zoom: 13,
          center: [106.550464, 29.563761],
        })
        setAMap(AMap)
        labelsLayer.current = createLabelsLayer(AMap)
        // 将 LabelsLayer 添加到地图上
        map.current.add(labelsLayer.current)
        //绑定地图点击事件
        map.current.on('click', e => handleClick(e, AMap, labelsLayer.current))
        //获取该项目的配送点数据
        let response = await reqPointList(project_id)
        let { markers, pointList } = processAMapData(
          response.data,
          AMap,
          mark_b
        )
        //一次性将海量点添加到图层
        labelsLayer.current.add(markers)
        uploadPointList(pointList)
      })
      .catch(e => {
        console.log(e)
      })
    return () => {
      labelsLayer.current.clear()
      map.current.removeLayer(labelsLayer.current)
    }
  }, [addPoint, uploadPointList, project_id])

  // 关键字搜索功能
  const onSearch = value => {
    if (value.trim() === '') return
    const { addPoint } = props
    const placeSearch = new AMap.PlaceSearch({
      //city: "重庆", // 兴趣点城市
      //citylimit: true, //是否强制限制在设置的城市内搜索
      pageSize: 10, // 单页显示结果条数
      children: 0, //不展示子节点数据
      pageIndex: 1, //页码
      extensions: 'base', //返回基本地址信息
    })
    //详情查询
    placeSearch.search(value, function (status, result) {
      if (status === 'complete' && result.info === 'OK') {
        placeSearch_CallBack(result)
      } else {
        message.error('查询地址失败', 1)
      }
    })
    const infoWindow = new AMap.InfoWindow({
      autoMove: true,
      offset: { x: 0, y: -30 },
    })
    //回调函数
    function placeSearch_CallBack(data) {
      const poiArr = data.poiList.pois
      const { name, address, location } = poiArr[0]
      const { lng: longitude, lat: latitude } = location
      //添加marker
      const marker = createLabelMarker(AMap, { longitude, latitude }, mark_b)
      addPoint({
        key: nanoid(),
        name,
        address,
        longitude,
        latitude,
        is_center: 0,
        marker,
      })
      labelsLayer.current.add(marker)
      map.current.setCenter(marker.getPosition())
      infoWindow.setContent(createContent(poiArr[0]))
      infoWindow.open(map.current, marker.getPosition())
    }
    function createContent(poi) {
      //信息窗体内容
      const s = []
      s.push('<b>名称：' + poi.name + '</b>')
      s.push('地址：' + poi.address)
      s.push('电话：' + poi.tel)
      s.push('类型：' + poi.type)
      return s.join('<br>')
    }
  }

  // 下载模板文件
  const downloadTemplateFile = () => {
    const option = {
      fileName: '模板',
      datas: [
        {
          sheetData: [
            {
              name: '重庆邮电大学',
              address: '崇文路2号',
              longitude: 106.607617,
              latitude: 29.530807,
              is_center: 1,
            },
            {
              name: '重庆来福士',
              address: '接圣街8号(朝天门地铁站2号口步行70米)',
              longitude: 106.587236,
              latitude: 29.564809,
              is_center: 0,
            },
          ],
          sheetName: 'sheet',
          sheetFilter: [
            'name',
            'address',
            'longitude',
            'latitude',
            'is_center',
          ],
          sheetHeader: [
            '服务点名称',
            '地址',
            '经度',
            '纬度',
            '是否为中心点(1:是,0:否)',
          ],
        },
      ],
    }
    exportExcel(option)
  }

  // 存储选取的配送点
  const savePoint = () => {
    const { selectPoint } = props
    let flag = false
    if (selectPoint.length < 1) {
      message.error('请选取中心点和配送点!', 1)
      return
    }
    let processPoint = selectPoint.map(point => {
      const { key, name, address, latitude, longitude, is_center } = point
      if (is_center === 1) {
        flag = true
      }
      return {
        key,
        name,
        address,
        latitude,
        longitude,
        is_center,
      }
    })
    if (!flag) {
      message.error('缺少中心点!', 1)
      return
    }
    reqInsertPoint(processPoint, project_id)
    reqUpdateState(1, project_id)
  }

  // 上传文件组件相关的配置
  const uploadProps = {
    accept: '.xls,.xlsx,application/vnd.ms-excel',
    beforeUpload: file => {
      return new Promise(resolve => {
        const reader = new FileReader()
        reader.onload = e => {
          try {
            const datas = e.target.result
            const workbook = XLSX.read(datas, { type: 'binary' }) //解析datas
            const first_worksheet = workbook.Sheets[workbook.SheetNames[0]] //是工作簿中的工作表的第一个sheet
            const jsonArr = XLSX.utils.sheet_to_json(first_worksheet, {
              header: 1,
              defval: '',
            }) //将工作簿对象转换为JSON对象数组
            let newArr = handleImpotedJson(jsonArr) // 数组处理
            let { markers, pointList } = processAMapData(newArr, AMap, mark_b)
            labelsLayer.current.clear()
            //一次性将海量点添加到图层
            labelsLayer.current.add(markers)
            uploadPointList(pointList)
            message.success('Excel上传解析成功!')
          } catch (e) {
            message.error('文件类型不正确!或文件解析错误')
          }
        }
        reader.readAsBinaryString(file)
      })
    },
  }

  return !username ? (
    <Navigate to="/home" />
  ) : (
    <div className="basic">
      <div id="container" className="select-point-map"></div>
      <div className="operation-navigation">
        <Button
          onClick={() => navigate(`/project-manage?username=${username}`)}
          className="back-home-btn"
        >
          <ArrowLeftOutlined />
        </Button>
        <Upload {...uploadProps}>
          <Button icon={<UploadOutlined />} shape="round">
            上传文件(Excel)
          </Button>
        </Upload>
        <Button
          icon={<DownloadOutlined />}
          shape="round"
          onClick={downloadTemplateFile}
          className="download-button"
        >
          模板文件下载
        </Button>
        <Button onClick={savePoint} icon={<SaveOutlined />} shape="round">
          保存记录
        </Button>
      </div>
      <Search
        onSearch={onSearch}
        placeholder="关键字搜索"
        allowClear
        className="search"
      />
      <PointDisplay labelsLayer={labelsLayer.current} />
    </div>
  )
}

export default connect(
  state => ({
    selectPoint: state.selectPoint,
  }),
  {
    addPoint,
    uploadPointList,
  }
)(ProjectPreparation)
