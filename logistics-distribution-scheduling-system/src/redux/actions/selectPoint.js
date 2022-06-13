import {
  ADD_POINT,
  DEL_POINT,
  UPLOAD_POINTLIST,
  SET_AS_CENTER_POINT
} from "../constant";

// 添加配送点
export const addPoint = pointObj => ({ type: ADD_POINT, data: pointObj });

// 删除配送点
export const delPoint = pointId => ({ type: DEL_POINT, data: pointId });

// 上传配送点
export const uploadPointList = pointList => ({
  type: UPLOAD_POINTLIST,
  data: pointList
});

// 设置为中心点
export const setAsCenterPoint = pointId => ({
  type: SET_AS_CENTER_POINT,
  data: pointId
});
