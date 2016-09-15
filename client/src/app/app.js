import React, { Component, PropTypes } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import * as courseActionsCreator from './actions/course';

const propTypes = {
  course: PropTypes.object,
  courseActions: PropTypes.object,
};


class App extends Component {
  constructor(props) {
    super(props);
    this.renderCourseTable = this.renderCourseTable.bind(this);
  }

  componentWillMount() {
    const { courseActions } = this.props;
    courseActions.fetchCourseList();
  }

  renderCourseTable() {
    const { course } = this.props;
    console.log("render table");
    let list = course.courseList.data;
    return list.map((c, i) => {
      return (
        <tr key={ c.name + "_" + i }>
          <td>{c.name}</td>
        </tr>
      )
    })
  }

  render() {
    const { course } = this.props;
    return (
      <main>
        <h1>Course List</h1>
        <table>
          <tbody>

          { !course.courseList.isLoading ? this.renderCourseTable() : null }
          </tbody>
        </table>
      </main>
    )
  }
}

App.propTypes = propTypes;


function mapStateToProps(state) {
  return {
    course: state.course
  };
}

function mapDispatchToProps(dispatch) {
  return {
    courseActions: bindActionCreators(courseActionsCreator, dispatch)
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(App);