import {
  ADD_PROJECT,
  DEL_PROJECT,
  UPLOAD_PROJECTLIST,
  UPDATE_PROJECT_STATE
} from "../constant";

// 添加项目
export const addProject = projectObj => ({
  type: ADD_PROJECT,
  data: projectObj
});

// 删除项目
export const delProject = project_id => ({
  type: DEL_PROJECT,
  data: project_id
});

// 上传项目列表
export const uploadProjectList = projectList => ({
  type: UPLOAD_PROJECTLIST,
  data: projectList
});

// 更新指定项目的状态
export const updateProjectState = (project_id, project_state) => ({
  type: UPDATE_PROJECT_STATE,
  data: { project_id, project_state }
});
