angular.module('MyApp')
  .directive('singleValueDonutChart', singleValueDonutChart)
  .directive('donutValue', donutValue)
  .directive('donutColor', donutColor);

function donutValue() {
  return {
    controller: function($scope) {}
  }
}


function donutColor() {
  return {
    controller: function($scope) {}
  }
}

function singleValueDonutChart() {

  return {

    restrict: 'AE',
    require: '^donutValue',
    scope: {
      donutValue: '@',
      donutColor: "@"
    },
    link: singleValueDonutChartLink
  }

  function singleValueDonutChartLink(scope, element, attrs) {

    element.css('display', 'block');

    attrs.$observe('donutValue', function(latestDonutValue) {

      if (!latestDonutValue)
        return;

      var data = [parseInt(latestDonutValue), 100 - latestDonutValue];

      var width  = 80;
      var height = 80;
      var radius = Math.min(width, height) / 2;

      var arc = d3.svg.arc()
        .outerRadius(radius)
        .innerRadius(radius - 5);

      var pie = d3.layout.pie()
        .sort(null)
        .value(function(d) {
          return d;
        });

      var svg = d3.select(element[0]).append("svg")
        .attr("width", width)
        .attr("height", height)
        .append("g")
        .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

      var g = svg.selectAll(".arc")
        .data(pie(data))
        .enter().append("g")
        .attr("class", "arc");

      g.append("path")
        .attr("d", arc)
        .style("fill", function(d, i) {
          return (i == 0) ? attrs.donutColor : '#dbe1e4'
        });

      svg.append('text')
        .data(data)
        .attr("font-size", "24px")
        .attr("fill", "black")
        .attr('text-anchor', 'middle')
        .attr('y', '10px')
        .text(data[0] + "%");

    });

  }

}