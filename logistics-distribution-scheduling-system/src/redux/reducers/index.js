import { combineReducers } from "redux";
import selectPointReducer from "./selectPoint";
import projectListReducer from "./projectList";

export default combineReducers({
  selectPoint: selectPointReducer,
  projectList: projectListReducer
});
