'use strict';

angular.module('myApp.emotive', [])

  .controller('emotiveCtrl', ['$scope', function($scope) {

    //var data = $scope.data;

// Generate some data.
    function plotData(tag) {

      var dataList = [];

      if ($scope.sentimentData && $scope.sentiments.indexOf(tag) > -1) {
        dataList = $scope.sentimentData[$scope.sentiments.indexOf(tag)][$scope.convIdx];
      }

      console.log("emotive plot", tag, dataList);

      tag = tag || "#emotive"
      angular.element(tag+" svg").remove();

// Build the plot.
      var plot = xkcdplot({
        xlabel: dataList.length ? "Date" : " ",
        ylabel: dataList.length ? "Sentiment" : " ",
        title: dataList.length ? "Sentiment over Time" : "upload message HTML (see guide)"
      });
      plot(tag);

      var colors = ['blue','red','green','purple','orange','aqua','lime','yellow','pink','brown','grey'];

// Add the lines.
      for (var idx in dataList) {
        plot.plot(dataList[idx], {stroke: colors[idx]});
      }

      if (!dataList.length) {
        plot.plot([{x:0,y:-1},{x:0,y:1}], {stroke:'black'});
      }

// Render the image.
      plot.xlim([-1.5, 7.5]).draw();
    }
    plotData($scope.sentiment);

    $scope.plotData = plotData;

    var sentiments = ["positive", "negative", "anger", "sadness", "joy", "disgust", "anticipation", "fear","surprise", "trust"];



  }]);