import {
  ADD_PROJECT,
  DEL_PROJECT,
  UPLOAD_PROJECTLIST,
  UPDATE_PROJECT_STATE
} from "../constant";

const initState = [];

export default function projectListReducer(preState = initState, action) {
  const { type, data } = action;
  switch (type) {
    case ADD_PROJECT: {
      return [...preState, data];
    }
    case DEL_PROJECT: {
      let filterResult = preState.filter(
        project => project.project_id !== data
      );
      return filterResult;
    }
    case UPLOAD_PROJECTLIST: {
      return [...data];
    }
    case UPDATE_PROJECT_STATE: {
      const { project_id, project_state } = data;
      let newState = preState.map(project =>
        project.project_id === project_id
          ? { ...project, project_state }
          : project
      );
      return newState;
    }
    default:
      return preState;
  }
}
