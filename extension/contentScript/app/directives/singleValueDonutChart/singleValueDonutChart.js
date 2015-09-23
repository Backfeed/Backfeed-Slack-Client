angular.module('MyApp').directive('singleValueDonutChart', function() {
    return {
        restrict: 'E',
        require: '^donutValue',
        scope: {
            donutValue: "&",
            donutColor: "@"
        },
        link: function(scope, element, attrs) {
            element.css('display', 'block');

            var data = [parseInt(attrs.donutValue), 100-attrs.donutValue];

            var width = 80,
                height = 80,
                radius = Math.min(width, height) / 2;

            var arc = d3.svg.arc()
                .outerRadius(radius)
                .innerRadius(radius - 5);

            var pie = d3.layout.pie()
                .sort(null)
                .value(function(d) { return d });

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
                .style("fill", function(d,i) { return (i == 0) ? attrs.donutColor : '#dbe1e4' });

            svg.append('text')
                .data(data)
                .attr("font-size", "24px")
                .attr("fill", "black")
                .attr('text-anchor', 'middle')
                .attr('y', '5px')
                .text(data[0]+"%");
        }
    }
});

angular.module('MyApp').directive('donutValue', function() {
    return {
        controller: function($scope) {}
    }
});

angular.module('MyApp').directive('donutColor', function() {
    return {
        controller: function($scope) {}
    }
});