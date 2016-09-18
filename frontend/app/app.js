'use strict';

// Declare app level module which depends on views, and components
angular.module('myApp', [
  'lr.upload',
  'myApp.comic',
  'myApp.emotive',
  'myApp.version'
]).
config(['$locationProvider', function($locationProvider, $routeProvider) {
  //$locationProvider.hashPrefix('!');
}]).controller('appCtrl', ['$scope', '$location','$http', function($scope, $location, $http) {

  $scope.onGlobalSuccess = function (response) {
    // console.log('AppCtrl.onSuccess', response);
    //
    // $scope.legends = response.data.map(function(thread){return thread.Members});
    //
    // $scope.sentimentData = spoolData(response.data);
    // console.log($scope.sentimentData);
    setup(response);

    // $scope.responseData = response.data;
    // $scope.uploads = $scope.uploads.concat(response.data.files);
  };


  var sentiments = ["positive", "negative", "anger", "sadness", "joy", "disgust", "anticipation", "fear","surprise", "trust"];
  $scope.sentiments = sentiments;
  $scope.convIdx = 0;

  function spoolData(threads) {
    return sentiments.map(function(sentiment){
      //console.log(typeof threads);
      return threads.map(function(thread){
        return thread.Members.map(function(user){
          var data = thread.Messages.filter(function(message) {
            return message.User === user;
          }).map(function (message) {
            return {x:dateToNum(message.Date),y:message.Sentiments[sentiment]};
          }).sort(function (a,b){
            return b.x-a.x;
          });

          var averaged = {};
          var averagedCount = {};

          for (var idx in data) {
            var obj = data[idx];
            if (!(averagedCount[obj.x])) {
              averaged[obj.x] = 0;
              averagedCount[obj.x] = 0;
            }
            averaged[obj.x] += obj.y;
            averagedCount[obj.x] += 1;
          }

          var averagedList = [];
          for (var key in averaged) {
            averagedList.push({x:key,y:.05+(averaged[key]/averagedCount[key])});
          }

          //console.log(averagedList[0], averagedList.length);
          return averagedList;
        });
      });
    });
  }

  function dateToNum(inputStr) {
    var months = ["Jan","Feb", "Mar", "Apr", "May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"]
    var spl = inputStr.split(/[ ,]+/);
    //console.log(spl);
    var d = new Date();
    //console.log(d);
    d.setMonth(months.indexOf(spl[1].substr(0,3)));
    d.setDate(spl[2]);
    d.setYear(spl[3]);
    //console.log(d);
    return Math.floor(d.valueOf()/1000/60/60/7);//Math.floor(d.valueOf()/1000/60/60/7);
  }

  console.log($location.hash());
  if ($location.hash() === ("debug")) {
    $http({
      method: 'GET',
      url: '/response.json'
    }).then(function successCallback(response) {
      setup(response);
    }, function errorCallback(response) {
      // called asynchronously if an error occurs
      // or server returns response with an error status.
    });
  }


  $scope.first = function() {
    angular.element("#comic").removeData();
    $scope.convIdx = 0;
    doPlots();
  };
  $scope.last = function() {
    angular.element("#comic").removeData();
    $scope.convIdx = $scope.sentimentData[0].length-1;
    doPlots();
  };
  $scope.next = function() {
    angular.element("#comic").removeData();
    $scope.convIdx += 1;
    $scope.convIdx %= $scope.sentimentData[0].length;
    doPlots();
  };
  $scope.prev = function() {
    angular.element("#comic").removeData();
    $scope.convIdx -= 1;
    $scope.convIdx = $scope.convIdx < 0 ? $scope.sentimentData[0].length : $scope.convIdx;
    doPlots();
  };
  $scope.random = function() {
    angular.element("#comic").removeData();
    $scope.convIdx = Math.floor(Math.random() * $scope.sentimentData[0].length);
    doPlots();
  };








  function plotData(tag) {

    var dataList = [];

    if ($scope.sentimentData && $scope.sentiments.indexOf(tag) > -1) {
      dataList = $scope.sentimentData[$scope.sentiments.indexOf(tag)][$scope.convIdx];
    }

    console.log("emotive plot", tag, dataList);
    //
    // tag = tag || "#emotive"
    // angular.element(tag+" svg").remove();

    var colors = ['blue','red','green','purple','orange','aqua','lime','yellow','pink','brown','grey'];

    var legend = {};
    for (var idx in dataList) {
      legend[colors[idx % 10]] = $scope.legends[$scope.convIdx][idx];
    }

// Build the plot.
    var plot = xkcdplot({
      xlabel: dataList.length ? "Date" : " ",
      ylabel: dataList.length ? "Sentiment" : " ",
      title: dataList.length ? tag+" over time" : "upload message HTML (see guide)",
      legend: legend
    });
    plot("#comic");

// Add the lines.
    var anything = false;
    for (var idx in dataList) {
      console.log(dataList[idx]);
      if (dataList[idx] && dataList[idx].length > 1) {
        anything = true;
        plot.plot(dataList[idx], {stroke: colors[idx % 10]});
      }
      //console.log(dataList[idx]);
    }
    // console.log($scope.sentimentData[0][0][0][0]);
    // plot.plot([$scope.sentimentData[0][0][0][0],{x:1,y:10}]);//$scope.sentimentData[0][0][0]);

    if (!dataList.length) {
      plot.plot([{x:0,y:-1},{x:0,y:1}], {stroke:'black'});
    }

// Render the image.


    //if (anything)
    plot/*.xlim([-1.5, 7.5])*/.draw();
  }

  function setup(response) {

    //response.data = response.data.filter(function(thread){return thread.Messages.length > 10;});

    $scope.sentimentData = spoolData(response.data);
    // console.log($scope.sentimentData)

    $scope.legends = response.data.map(function(thread){return thread.Members});
    // console.log('legends:',response.data);

  }

  function doPlots() {
    angular.element("#comic").empty();
    $scope.sentiments.forEach(function(sent){
      plotData(sent);
    })
  }
  doPlots();

}]);
