import {
  COURSE_SET_LIST,
  COURSE_SET_LIST_STATUS
} from '../constants/course';

const initialState = {
  courseList: {
    isLoading: true,
    data: []
  }
};

const course = (state = initialState, action) => {
  switch (action.type) {
    case COURSE_SET_LIST:
      return Object.assign({}, state, {
        courseList: Object.assign({}, state.courseList, {
          data: action.data
        })
      });
    case COURSE_SET_LIST_STATUS:
      return Object.assign({}, state, {
        courseList: Object.assign({}, state.courseList, {
          isLoading: action.status
        })
      });
    default:
      return state;
  }
};

export default course;