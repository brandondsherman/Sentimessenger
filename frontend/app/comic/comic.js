'use strict';

angular.module('myApp.comic', [])

  .controller('comicCtrl', ['$scope', function($scope) {

    $scope.next = function () {
      if (!$scope.data) return;

      $scope.data();
    };


    function plotData(tag) {

      var dataList = [];

      if ($scope.sentimentData && $scope.sentiments.indexOf(tag) > -1) {
        dataList = $scope.sentimentData[$scope.sentiments.indexOf(tag)][$scope.convIdx];
      }

      //console.log("emotive plot", tag, dataList);
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
      for (var idx in dataList) {
        plot.plot(dataList[idx], {stroke: colors[idx % 10]});
        //console.log(dataList[idx]);
      }
      // console.log($scope.sentimentData[0][0][0][0]);
      // plot.plot([$scope.sentimentData[0][0][0][0],{x:1,y:10}]);//$scope.sentimentData[0][0][0]);

      if (!dataList.length) {
        plot.plot([{x:0,y:-1},{x:0,y:1}], {stroke:'black'});
      }

// Render the image.
      plot/*.xlim([-1.5, 7.5])*/.draw();
    }

    function doPlots() {
      $scope.sentiments.forEach(function(sent){
        plotData(sent);
      })
    }
    doPlots();

  }]);