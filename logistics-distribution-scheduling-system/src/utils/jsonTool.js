import { nanoid } from 'nanoid'
import JsExportExcel from 'js-export-excel'

// handleImpotedJson方法可以将json对象进行一系列操作
export const handleImpotedJson = array => {
  array.shift()
  return array.map(item => ({
    key: nanoid(),
    name: item[0],
    address: item[1],
    longitude: item[2],
    latitude: item[3],
    is_center: item[4]
  }))
}

// 导出Excel文件,只支持导出一张表
export const exportExcel = option => {
  // 执行导出
  const toExcel = new JsExportExcel(option)
  toExcel.saveExcel()
}
