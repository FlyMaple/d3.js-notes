var $application = angular.module('application', []);

$application.controller('masterCtrl', ['$scope', function ($scope) {
    $scope.trafficChartToolTipFormat = function () {
        var tooltip_template = '' +
            '<div>' +
            '    <div class="app_name">Google</div>' +
            '    <div class="usage">' +
            '        <span>Application:</span>' +
            '        <span><b>58.56%<b></span>' +
            '    </div>' +
            '</div>';
        var $tooltip = angular.element(tooltip_template);

        $tooltip.update = function (data) {
            $tooltip.find('.app_name').text(data.name);
            $tooltip.find('.usage span:eq(1) b').text(data.usage.toFixed(2) + '%');

            return $tooltip;
        };

        return $tooltip;
    };

    
    //  =================================
    window.$scope = typeof($scope) === 'undefined' ? {} : $scope;
    window.$rootScope = typeof($rootScope) === 'undefined' ? {} : $rootScope;
    window.managementAPI = typeof(managementAPI) === 'undefined' ? {} : managementAPI;
    window.gatewayAPI = typeof(gatewayAPI) === 'undefined' ? {} : gatewayAPI;
    window.switchAPI = typeof(switchAPI) === 'undefined' ? {} : switchAPI;
    window.accesspointAPI = typeof(accesspointAPI) === 'undefined' ? {} : accesspointAPI;
    window.$modal = typeof($modal) === 'undefined' ? {} : $modal;
    window.$filter = typeof($filter) === 'undefined' ? {} : $filter;
    window.authAPI = typeof(authAPI) === 'undefined' ? {} : authAPI;
    window.$text = typeof($text) === 'undefined' ? {} : $text;
    window.$q = typeof($q) === 'undefined' ? {} : $q;
    //  =================================
    
}])
.controller('DateController', ['$scope', function($scope) {
    $scope.example = {
      value: new Date(2018, 5, 1)
    };
  }]);;

var lighten = function (color, percent) {
    var num = parseInt(color.substring(1), 16),
        amt = Math.round(2.55 * percent),
        R = (num >> 16) + amt,
        B = (num >> 8 & 0x00FF) + amt,
        G = (num & 0x0000FF) + amt;

    return '#' + (0x1000000 + (R < 255 ? R < 1 ? 0 : R : 255) * 0x10000 + (B < 255 ? B < 1 ? 0 : B : 255) * 0x100 + (G < 255 ? G < 1 ? 0 : G : 255)).toString(16).slice(1);
};

var setTooltip = function (scope, element) {
    var $tooltip = scope.tooltip().addClass('ui-d3-chart-tooltip');

    element.append($tooltip);

    scope.$tooltip = $tooltip;
};

var createSVG = function (scope, element) {
    var data = [{
        name: 'Java',
        usage: 123,
    }, {
        name: 'Python',
        usage: 321,
    }, {
        name: 'Javascript',
        usage: 999,
    }, {
        name: 'Go',
        usage: 222,
    }, {
        name: 'CSS',
        usage: 888,
    }];

    var instance = element[0]
    var $instance = element;
    var instance_parent = instance.parentNode;
    var $tooltip = scope.$tooltip;

    var parent_width = scope.width || instance_parent.clientWidth;
    var parent_height = scope.height || instance_parent.clientHeight;
    var donut_radius = Math.floor(Math.min(parent_width, parent_height) / 2);
    var donut_inner_radius = parseFloat(scope.innerRadius, 10);
    var donut_outer_radius = parseFloat(scope.outerRadius, 10);
    var donut_hover_outer_radius = parseFloat(scope.outerRadius, 10) + parseFloat(scope.arcHoverSize, 10);
    var legendOffset = scope.legendOffset || 0;

    // 開啟 legend，chart width 要切半
    if (scope.legend) {
        donut_radius = Math.floor(Math.min(parent_width / 2, parent_height) / 2);
        donut_inner_radius = parseFloat(scope.innerRadius, 10) / 2;
        donut_outer_radius = parseFloat(scope.outerRadius, 10) / 2;
        scope.centerTextSize = parseFloat(scope.centerTextSize, 10) / 2;
        donut_hover_outer_radius = donut_outer_radius + parseFloat(scope.arcHoverSize, 10);
    }

    var pie = d3.pie()
        .value(function (d) { return d[scope.uiDataValue]; })
        .sort(function (a, b) {
            if (a[scope.uiDataValue] < b[scope.uiDataValue]) { return 1; }
            if (a[scope.uiDataValue] > b[scope.uiDataValue]) { return -1; }
            return 0;
        });

    var colour = d3.scaleOrdinal(d3.schemeCategory10);

    var arc = d3.arc()
        .innerRadius(donut_inner_radius)
        .outerRadius(donut_outer_radius);
    var arcHover = d3.arc()
        .innerRadius(donut_inner_radius)
        .outerRadius(donut_hover_outer_radius);

    var svg = d3.select(instance)
        .append('svg')
        .attr('width', parent_width)
        .attr('height', parent_height);

    var donut_g = svg.append('g')
        .attr('transform', function () {
            if (scope.legend) {
                if (scope.legendAlign === 'left') {
                    return 'translate(' + ((parent_width / 4) * 3) + ', ' + parent_height / 2 + ')';
                }
                return 'translate(' + parent_width / 2 / 2 + ', ' + parent_height / 2 + ')';
            } else {
                return 'translate(' + parent_width / 2 + ', ' + donut_radius + ')';
            }
        });

    var donut_part_g = donut_g.selectAll('.donut_part_path')
        .data(pie(data))
        .enter();

    var donut_part_path = donut_part_g.append('path')
        .attr('d', arc)
        .attr('fill', function (d) { return colour(d.data[scope.uiDataText]); })
        .attr('stroke', '#ffffffa3')
        .attr('stroke-width', 2)
        .on('mouseover', function (d) {
            d3.select(this).transition()
                .duration(500)
                .attr('d', arcHover)
                .attr('fill', function (d) { return lighten(colour(d.data[scope.uiDataText]), 5) })

            $tooltip.css({
                'border-color': colour(d.data[scope.uiDataText], 5),
            });
        })
        .on('mouseout', function (d) {
            d3.select(this)
                .transition()
                .duration(500)
                .attr('d', arc)
                .attr('fill', function (d) { return colour(d.data[scope.uiDataText]) });

            $tooltip.removeClass('transition')
                .css({
                    transform: 'initial',
                    opacity: 0,
                });
        })
        .on('mousemove', function (d) {
            var width = $tooltip.width();
            var height = $tooltip.height();

            var mouse_geo = d3.mouse(this);
            var x = (parent_width / 2) + mouse_geo[0] - (width / 2) + 'px';
            var y = donut_radius + mouse_geo[1] - height - 20 + 'px';

            if (scope.legend) {
                x = (parent_width / 2 / 2) + mouse_geo[0] - (width / 2) + 'px';
                y = (parent_height / 2) + mouse_geo[1] - height - 20 + 'px';
                if (scope.legendAlign === 'left') {
                    x = ((parent_width / 4) * 3) + mouse_geo[0] - (width / 2) + 'px';
                }
            }

            $tooltip.addClass('transition')
                .update(d.data)
                .css({
                    transform: 'translate(' + x + ', ' + y + ')',
                    opacity: 1,
                });
        })
        .transition()
        .duration(1000)
        .attrTween('d', function (d) {
            var interpolate = d3.interpolate({ startAngle: 0, endAngle: 0 }, d);
            return function (t) {
                return arc(interpolate(t));
            };
        });

    var center_text = donut_g.append('text')
        .attr('dy', '.35em')
        .attr('fill', 'gold')
        .attr('text-anchor', 'middle')
        .attr('font-size', scope.centerTextSize + 'em')
        .attr('font-weight', 'bold')
        .text(scope.centerText);

    var legend, legend_part_g, legend_rect, legend_text, legend_container;
    if (scope.legend) {
        legend = svg.append('g');

        legend_part_g = legend.selectAll('.legend_part_g')
            .data(data.sort(function (a, b) {
                if (a[scope.uiDataValue] < b[scope.uiDataValue]) { return 1; }
                if (a[scope.uiDataValue] > b[scope.uiDataValue]) { return -1; }
                return 0;
            }))
            .enter()
            .append('g')
            .attr('transform', function (d, i) {
                return 'translate(0, ' + (i * 22) + ')';
            });

        legend_rect = legend_part_g.append('rect')
            .attr('width', 15)
            .attr('height', 15)
            .attr('fill', function (d) { return colour(d[scope.uiDataText]); })
            .attr('stroke', '#ffffffa3');

        legend_text = legend_part_g.append('text')
            .attr('x', 20)
            .attr('y', 13)
            .attr('fill', '#e4e4e4')
            .attr('font-size', 12)
            .text(function (d) {
                var text = d[scope.uiDataText].split('');

                for (var i = 0; i < text.length; i++) {
                    var t = text[i];

                    this.append(t);
                    if ((this.getComputedTextLength() + legendOffset + 20) > (parent_width / 2) - 40) {
                        var tt = this.innerHTML.split('');
                        tt.pop();
                        tt.push('...')
                        this.innerHTML = tt.join('');
                        break;
                    }
                }
                return this.innerHTML;
            });

        legend_text.append('title')
            .text(function (d) {
                return d[scope.uiDataText];
            })

        var legend_translate_x, legend_translate_y;
        legend.attr('transform', function () {
            if (scope.legendAlign === 'left') {
                legend_translate_x = 20 + legendOffset;
                legend_translate_y = (parent_height / 2) - (this.getBBox().height / 2);
                return 'translate(' + legend_translate_x + ', ' + legend_translate_y + ')';
            }
            legend_translate_x = (parent_width / 2) + (10 + legendOffset);
            legend_translate_y = (parent_height / 2) - (this.getBBox().height / 2) + 2;
            return 'translate(' + legend_translate_x + ', ' + legend_translate_y + ')';
        });

        var $disable_legend = element.find('.ui-disable-legend');
        legend_translate_y = (parent_height / 2) - ($disable_legend.height()  / 2)
        element.find('.ui-disable-legend').css({
            transform: 'translate(' + legend_translate_x + 'px, ' + legend_translate_y + 'px)',
        });
    }
};

$application.directive('d3Donut', ['$rootScope', '$filter',
    function ($rootScope, $filter) {
        return {
            restrict: 'E',
            replace: true,
            transclude: true,
            scope: {
                width: "=",
                height: "=",
                data: '=',
                uiDataText: '@',
                uiDataValue: '@',
                innerRadius: '=',
                outerRadius: '=',
                centerText: '@',
                centerTextSize: '@',
                arcHoverSize: '=',
                legend: '=',
                legendAlign: '@',
                legendOffset: '=',
                legendTextWidth: '=',
                tooltip: '='
            },
            link: function (scope, element, attrs) {
                window.angular = angular;
                window.scope = scope;
                window.element = element;
                setTooltip(scope, element);
                createSVG(scope, element);
            },
            template: '<div class="ui-d3-chart"><div ng-transclude></div></div>',
        };
    }
]);