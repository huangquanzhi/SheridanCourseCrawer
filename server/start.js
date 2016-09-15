var express = require('express');
var app = express();
var Promise = require('promise');

var Crawler = require("crawler");
var url = require("url");
var sheridanCourseUrl = "https://academics.sheridancollege.ca/";


// list of courses' detailed data
var courseList = [];

function requestCourseList() {
  return new Promise(function (resolve, reject) {
    crawlerStart(resolve, reject);
  });
}

function crawlerStart(resolve, reject) {
  var courseLinks = [];

  var c = new Crawler({
    jQuery: true,
    maxConnections: 50,
    skipDuplicates: true,
    callback: function (error, result, $) {

      // search for link of all courses
      $('.program-list').find("a").each(function (index, a) {
        courseLinks.push({
          url: sheridanCourseUrl + $(a).attr("href"),
          callback: searchForAvailability
        });
      });
    },
    // scrape for detail information
    onDrain: function () {
      // reset course data list
      courseList = [];

      // crawler for retrieving course information
      var courseCraw = new Crawler({
        jQuery: true,
        maxConnections: 50,
        onDrain: function () {
          if (courseList.length > 0) {
            console.log("Done. Result granted");
            resolve({
              data: courseList,
              length: courseList.length
            });
          } else {
            reject("Failed to load courses!");
          }
        }
      });
      console.log("=======" + new Date() + "=======");
      console.log("Searching for course information ...");
      // start the crawler
      courseCraw.queue(courseLinks);
      //reset link list
      courseLinks = [];
    }
  });

  // start main crawler to grab links
  c.queue(sheridanCourseUrl + "programs/alpha");
}


// callback for extracting course information
var searchForAvailability = function (error, result, $) {
  // grad the course name from result
  var courseName = $(".faculty").next().text();
  // init program level / diploma, bachelor, etc
  var typeName = "";
  // temp list of the program level's start date
  // ex. diploma - [{ startDate, location}, {startDate, location}]
  var tempStartDatesList = [];
  // set init state of the course the crawler is fetching
  var tempCourse = {
    name: courseName,
    programType: []
  };

  // templates
  var startDates = {
    date: '',
    location: '',
    availability: ''
  };

// every program level options
  $(".plan-item").find("li").filter(".row").each(function (index, li) {
    // program level / diploma, bachelor, etc
    typeName = $(li).find("h4").text();
    //every start date - ROW
    $(li).find("tbody").each(function (index, tr) {
      var tdIndex = 0; // index of which table column its in
      //start date of the program level
      var tempStartDates = startDates;
      // every table data in the row
      $(tr).find("td").each(function (index, td) {
        var tdData = $(td).text(); // text of data
        // if true,  the row ended
        if (index % 3 == 0 || index == 0) {
          // date field
          tempStartDates = Object.assign({}, tempStartDates, {
            date: tdData
          });
          // reset to first column
          tdIndex = 0;
        } else {
          tdIndex++;
          if (tdIndex == 1) {
            // location field
            tempStartDates = Object.assign({}, tempStartDates, {
              location: tdData
            });
          } else {
            // availability field
            tempStartDates = Object.assign({}, tempStartDates, {
              availability: tdData
            });
          }
          // count to next column

        }
      });
      // push row startDate to list
      tempStartDatesList.push(tempStartDates);
    });
    // push the start dates of current program level to the programType array
    tempCourse.programType.push({
      name: typeName,
      startDates: tempStartDatesList
    });
    // reset the startDates list
    tempStartDatesList = [];

  });

  // push the program to courseLists
  courseList.push(tempCourse);

};


app.get('/', function (req, res) {

  requestCourseList()
    .then(function (response) {
      console.log("Sending Results");
      res.send(JSON.stringify(response));
    }).catch(function (err) {
    res.status(500);
    res.render('error', { error: err })
  });


});

app.listen(3000, function () {
  console.log('Listening on port 3000!');
});
