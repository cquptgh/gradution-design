import {
  ADD_POINT,
  DEL_POINT,
  UPLOAD_POINTLIST,
  SET_AS_CENTER_POINT
} from "../constant";

const initState = [];

export default function selectPointReducer(preState = initState, action) {
  const { type, data } = action;
  switch (type) {
    case ADD_POINT: {
      return [...preState, data];
    }
    case DEL_POINT: {
      let filterResult = preState.filter(point => point.key !== data);
      return filterResult;
    }
    case UPLOAD_POINTLIST: {
      return [...data];
    }
    case SET_AS_CENTER_POINT: {
      let newState = preState.map(point =>
        point.key === data
          ? { ...point, is_center: 1 }
          : { ...point, is_center: 0 }
      );
      return newState;
    }
    default:
      return preState;
  }
}
