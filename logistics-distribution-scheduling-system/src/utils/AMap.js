import { nanoid } from 'nanoid'
import marke_r from '@/assets/image/mark_r.png'
import mid from '@/assets/image/mid.png'
import car from '@/assets/image/car.png'

const colorList = ['#108ee9', '#f50', '#2db7f5', '#87d068']

export const processAMapData = (data, AMap, img) => {
  const pointList = []
  const markers = []
  data.forEach(item => {
    const { name, address, longitude, latitude, is_center } = item
    let marker = createLabelMarker(
      AMap,
      {
        longitude: parseFloat(longitude),
        latitude: parseFloat(latitude)
      },
      img
    )
    markers.push(marker)
    pointList.push({
      key: nanoid(),
      name,
      address,
      longitude,
      latitude,
      is_center,
      marker
    })
  })
  return {
    pointList,
    markers
  }
}

export const createLabelMarker = (AMap, coordinate, image) => {
  const labelMarker = new AMap.LabelMarker({
    position: [coordinate.longitude, coordinate.latitude],
    opacity: 1,
    zIndex: 2,
    //图标对象
    icon: {
      type: 'image',
      image,
      size: [20, 30],
      anchor: 'bottom-center',
      angel: 0,
      retina: true
    },
    offset: new AMap.Pixel(-10, -30)
  })
  return labelMarker
}

export const createLabelsLayer = AMap => {
  // 创建一个 LabelsLayer 实例来承载 LabelMarker
  const labelsLayer = new AMap.LabelsLayer({
    zooms: [3, 20],
    zIndex: 111,
    animation: false,
    collision: false
  })
  return labelsLayer
}

export const parseRouteToPath = route => {
  const path = []
  for (let i = 0, l = route.steps.length; i < l; i++) {
    const step = route.steps[i]
    for (let j = 0, n = step.path.length; j < n; j++) {
      path.push(step.path[j])
    }
  }
  return path
}

const createMarker = (AMap, map, path, image, x, y) => {
  return new AMap.Marker({
    position: path,
    icon: image,
    map,
    offset: new AMap.Pixel(x, y)
  })
}

const createPolyline = (AMap, path, colorNumber) => {
  return new AMap.Polyline({
    path,
    isOutline: true,
    outlineColor: '#ffeeee',
    borderWeight: 1,
    strokeWeight: 6,
    showDir: true,
    strokeOpacity: 0.9,
    strokeColor: colorList[colorNumber],
    lineJoin: 'round'
  })
}

export const startAnimation = (marker, lineArr) => {
  marker.moveAlong(lineArr, {
    // 每一段的时长
    duration: 30, //可根据实际采集时间间隔设置
    // JSAPI2.0 是否延道路自动设置角度在 moveAlong 里设置
    autoRotation: true
  })
}

export const pauseAnimation = marker => {
  marker.pauseMove()
}

export const resumeAnimation = marker => {
  marker.resumeMove()
}

export const stopAnimation = marker => {
  marker.stopMove()
}

export const generateRouteLine = (route, AMap, map, colorNumber) => {
  const length = route.length
  // 构造路线导航类
  const driving = new AMap.Driving({
    policy: AMap.DrivingPolicy.LEAST_TIME
  })
  let carMarkerAndLineArr

  return Promise.all(
    route.map((item, index) => {
      return new Promise((resolve, reject) => {
        if (index === length - 1) {
          resolve({
            distance: 0,
            time: 0
          })
        }
        driving.search(
          new AMap.LngLat(route[index]['longitude'], route[index]['latitude']),
          new AMap.LngLat(
            route[index + 1]['longitude'],
            route[index + 1]['latitude']
          ),
          (status, result) => {
            if (status === 'complete') {
              if (result.routes && result.routes.length) {
                carMarkerAndLineArr = drawRoute(
                  result.routes[0],
                  index,
                  route[index].name
                )
              }
            }
            if (index === 0) {
              resolve({
                distance: result.routes[0].distance,
                time: result.routes[0].time,
                carMarker: carMarkerAndLineArr.carMarker,
                lineArr: carMarkerAndLineArr.lineArr
              })
            } else {
              resolve({
                distance: result.routes[0].distance,
                time: result.routes[0].time,
                lineArr: carMarkerAndLineArr.lineArr
              })
            }
          }
        )
      })
    })
  )

  function drawRoute(route, index, address) {
    const path = parseRouteToPath(route)
    const routeLine = createPolyline(AMap, path, colorNumber)
    let marker, carMarker, lineArr
    lineArr = path.map(item => [item.lng, item.lat])
    if (index === 0) {
      marker = createMarker(AMap, map, path[0], marke_r, -10, -31)
      carMarker = createMarker(AMap, map, path[0], car, -13, -26)
      marker.setLabel({
        direction: 'right',
        offset: new AMap.Pixel(-10, 24),
        content: `<div>中心点:${address}</div>`
      })
      /* carMarker.on('moving', function (e) {
        map.setCenter(e.target.getPosition(), true)
      }) */
      map.add(routeLine)
    } else {
      let marker = createMarker(AMap, map, path[0], mid, -13, -26)
      marker.setLabel({
        direction: 'right',
        offset: new AMap.Pixel(-10, 24),
        content: `<div>${address}</div>`
      })
      map.add(routeLine)
    }
    return { carMarker, lineArr }
  }
}
