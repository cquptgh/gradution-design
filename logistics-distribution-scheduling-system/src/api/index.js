/*
  要求: 能根据接口文档定义接口请求
  包含应用中所有接口请求函数的模块
  每个函数的返回值都是promise

  基本要求: 能根据接口文档定义接口请求函数
 */
import ajax from './ajax'

const BASE = '/api'

// 注册用户
export const reqRegister = (username, password, captcha) =>
  ajax(BASE + '/register', { username, password, captcha }, 'POST')

// 登录
export const reqLogin = (username, password, captcha) =>
  ajax(BASE + '/login', { username, password, captcha }, 'POST ')

// 创建项目
export const reqCreateProject = (project_id, project_name, username) =>
  ajax(BASE + '/create-project', { project_id, project_name, username }, 'POST')

// 获取项目列表
export const reqProjectList = username =>
  ajax(BASE + `/get-project/${username}`)

// 获取指定项目id的配送点
export const reqPointList = project_id =>
  ajax(BASE + `/get-pointlist/${project_id}`)

// 删除指定id的项目
export const reqDeleteProject = project_id =>
  ajax(BASE + `/delete-project/${project_id}`)

// 向数据库插入配送点数据
export const reqInsertPoint = (pointList, project_id) =>
  ajax(BASE + '/insert-point', { pointList, project_id }, 'POST')

// 更新指定项目的状态
export const reqUpdateState = (project_state, project_id) =>
  ajax(BASE + '/update-state', { project_state, project_id }, 'PUT')

// 更新指定项目的车辆数量
export const reqUpdateVehicleNumber = (vehicle_number, project_id) =>
  ajax(BASE + '/update-vehicle', { vehicle_number, project_id }, 'PUT')

// 执行算法
export const reqInvokerExecutor = (project_id, vehicle_number) =>
  ajax(BASE + '/invoker-executor', { project_id, vehicle_number }, 'POST')

// 获取路线
export const reqGetRoute = project_id => ajax(BASE + `/get-route/${project_id}`)

// 下载
export const reqDownLoadFile = project_id =>
  ajax(BASE + `/get-route/${project_id}`)
