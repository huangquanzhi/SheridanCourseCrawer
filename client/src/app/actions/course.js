import {
  COURSE_SET_LIST,
  COURSE_SET_LIST_STATUS
} from '../constants/course';

import {
  API_COURSE_LIST_URL
} from '../constants/settings';

export const setCourseList = (courseList) => {
  return { type: COURSE_SET_LIST, data: courseList }
};

export const isCourseListFetching = (status) => {
  return { type: COURSE_SET_LIST_STATUS, status }
};

export const fetchCourseList = () => {
  return (dispatch, getState) => {
    // start fetching course list from api
    // go into loading mode
    dispatch(isCourseListFetching(true));

    fetch(API_COURSE_LIST_URL)
      .then((response) => {
        if (response.status === 200) {
          return response.json();
        }
      })
      .then((responseData) => {
        if (responseData.length) {
          dispatch(setCourseList(responseData.data));
        } else {
          dispatch(setCourseList([]));
        }
        // course fetch completed
        dispatch(isCourseListFetching(false));
      }).catch((err) => {
      console.log(err);
    })
  }
};