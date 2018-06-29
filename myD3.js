
function example_1() {
    var data = [12, 28, 31, 40, 56, 67, 73, 80, 95];

    var ctx = d3.select('#example_1');
    // console.log(`d3.select('#example_1')`, ctx);
    // console.log(`ctx.select('svg')`, ctx.select('svg'));
    // console.log(`ctx.selectAll('svg')`, ctx.selectAll('svg'));
    // console.log(`--------`);

    // var data = ctx.data(data);
    // var enter = data.enter();
    // var append = enter.append('div');

    // console.log(`ctx.data(data)`, data);
    // console.log(`ctx.data(data).enter()`, enter);
    // console.log(`ctx.data(data).enter().append('div')`, enter.append('div'));
    // console.log(`--------`);
    // d3.selectAll('#example_1 div').remove();

    // ctx.data(data)
    // 這裡使用了 data 所以綁定層級會不一樣，會綁定在 parentNode => html，所以 append 會作用在 html
    // ctx.selectAll('div').data(data)
    // 所以要先往下一層，將選擇器填入不存在的dom，會找不到，但是 parentNode 會變成 #example_1，所以 append 會作用在 #example_1
    // 若是 ctx.selectAll('div') 有選擇到 dom，parentNode 也會變成 #example_1，但是就會 append 在找到的那個 dom 下
    // ctx.select() 這個方法若找不到，parentNode 不會被變更，所以不適用
    data = ctx.selectAll('div').data(data);
    enter = data.enter();
    append = enter.append('div');
    append = append.text(function (d) {
        return d;
    });
    append = append.styles({
        color: function (d) {
            if (d < 60) { return 'red'; }
        },
        background: function (d) {
            if (d < 60) { return '#ffb6b6'; }
            return '#abe5ff';
        },
        width: function (d) {
            return `${d}%`;
        },
        margin: '2px 0',
        padding: '2px',
        'font-size': '10px',
        'text-align': 'right',
    });

    console.log(`ctx.selectAll('div').data(data)`, data);
    console.log(`ctx.selectAll('div').data(data).enter()`, enter);
    console.log(`ctx.selectAll('div').data(data).enter().append('div')`, append);
    console.log(`ctx.selectAll('div').data(data).enter().append('div').text()`, append);
    console.log(`ctx.selectAll('div').data(data).enter().append('div').style()`, append);
}
// example_1();


(function () {
    // Seed data to populate the donut pie chart
    var seedData = [{
        "label": "React React React React React",
        "value": 25,
        "link": "https://facebook.github.io/react/"
    }, {
        "label": "Redux",
        "value": 25,
        "link": "https://redux.js.org/"
    }, {
        "label": "Vue.js",
        "value": 25,
        "link": "https://vuejs.org/"
    }, {
        "label": "AngularJS",
        "value": 25,
        "link": "https://angularjs.org/"
    }, {
        "label": "Meteor",
        "value": 25,
        "link": "https://meteorhacks.com/meteor-js-web-framework-for-everyone"
    }, {
        "label": "Node.js",
        "value": 25,
        "link": "https://nodejs.org/"
    }];

    // Define size & radius of donut pie chart
    var width = 450,
        height = 450,
        radius = Math.min(width, height) / 2;

    // Define arc colours
    var colour = d3.scaleOrdinal(d3.schemeCategory20);

    // Define arc ranges
    var arcText = d3.scaleOrdinal()
        .range([0, width]);

    // Determine size of arcs
    var arc = d3.arc()
        .innerRadius(radius - 130)
        .outerRadius(radius - 10);

    // Create the donut pie chart layout
    var pie = d3.pie()
        .value(function (d) { return d["value"]; })
        .sort(null);

    // Append SVG attributes and append g to the SVG
    var svg = d3.select("#example_2")
        .attr("width", width)
        .attr("height", height)
        .append("g")
        .attr("transform", "translate(" + radius + "," + radius + ")");

    // Define inner circle
    svg.append("circle")
        .attr("cx", 0)
        .attr("cy", 0)
        .attr("r", 100)
        .attr("fill", "#fff");

    // Calculate SVG paths and fill in the colours
    var g = svg.selectAll(".arc")
        .data(pie(seedData))
        .enter().append("g")
        .attr("class", "arc")

        // Make each arc clickable 
        .on("click", function (d, i) {
            window.location = seedData[i].link;
        });

    // Append the path to each g
    g.append("path")
        .attr("d", arc)
        .attr("fill", function (d, i) {
            return colour(i);
        });

    // Append text labels to each arc
    g.append("text")
        .attr("transform", function (d) {
            return "translate(" + arc.centroid(d) + ")";
        })
        .attr("dy", ".35em")
        .style("text-anchor", "middle")
        .attr("fill", "#fff")
        .text(function (d, i) { return seedData[i].label; })

    g.selectAll(".arc text").call(wrap, arcText.range([0, width]));

    // Append text to the inner circle
    svg.append("text")
        .attr("dy", "-0.5em")
        .style("text-anchor", "middle")
        .attr("class", "inner-circle")
        .attr("fill", "#36454f")
        .text(function (d) { return 'JavaScript'; });

    svg.append("text")
        .attr("dy", "1.0em")
        .style("text-anchor", "middle")
        .attr("class", "inner-circle")
        .attr("fill", "#36454f")
        .text(function (d) { return 'is lots of fun!'; });

    // Wrap function to handle labels with longer text
    function wrap(text, width) {
        text.each(function () {
            var text = d3.select(this),
                words = text.text().split(/\s+/).reverse(),
                word,
                line = [],
                lineNumber = 0,
                lineHeight = 1.1, // ems
                y = text.attr("y"),
                dy = parseFloat(text.attr("dy")),
                tspan = text.text(null).append("tspan").attr("x", 0).attr("y", y).attr("dy", dy + "em");
            console.log("tspan: " + tspan);
            while (word = words.pop()) {
                line.push(word);
                tspan.text(line.join(" "));
                if (tspan.node().getComputedTextLength() > 90) {
                    line.pop();
                    tspan.text(line.join(" "));
                    line = [word];
                    tspan = text.append("tspan").attr("x", 0).attr("y", y).attr("dy", ++lineNumber * lineHeight + dy + "em").text(word);
                }
            }
        });
    }
});
function example_2() {
    var seedData = [{
        "label": "React React React React React",
        "value": 25,
        "link": "https://facebook.github.io/react/"
    }, {
        "label": "Redux",
        "value": 25,
        "link": "https://redux.js.org/"
    }, {
        "label": "Vue.js",
        "value": 25,
        "link": "https://vuejs.org/"
    }, {
        "label": "AngularJS",
        "value": 25,
        "link": "https://angularjs.org/"
    }, {
        "label": "Meteor",
        "value": 25,
        "link": "https://meteorhacks.com/meteor-js-web-framework-for-everyone"
    }, {
        "label": "Node.js",
        "value": 25,
        "link": "https://nodejs.org/"
    }];

    // 定義 svg 長寬高，以及 donut chart 長寬高
    var width = 450,
        height = 450,
        radius = Math.min(width, height) / 2;

    // 宣告顏色物件，要自訂也可以
    // d3.schemeCategory10
    // d3.schemeCategory20
    // d3.schemeCategory20b
    // d3.schemeCategory20c
    var colour = d3.scaleOrdinal(d3.schemeCategory20);

    // ???
    var arcText = d3.scaleOrdinal().range([0, width]);

    // 宣告弧形半徑，內圈外圈半徑
    var arc = d3.arc().innerRadius(radius - 130).outerRadius(radius - 10);

    // 宣告 pie chart layout
    var pie = d3.pie()
        .value(function (d) {
            return d.value;
        })
        .sort(null);

    // 宣告 svg 物件，以及 g 物件，並移至 svg 中心
    var svg = d3.select('#example_2')
        .attrs({
            width,
            height,
        })
        .style('display', 'initial')
        .append('svg')
        .attrs({
            width: width,
            height: height,
        }).append('g')
        .attrs({
            transform: 'translate(' + width / 2 + ', ' + height / 2 + ')',
        });

    // 在 donut 中間放一個 circle 物件
    // cx、cy 元的中心點往xy延伸距離(圓形、橢圓)
    var circle = svg.append('circle')
        .attrs({
            r: 100,
            cx: 0,
            cy: 0,
            fill: '#fff',
        });

    // 中心的文字
    // 注意這裡不是放在 circle 裡面，svg 世界裡都是平行層，然後用絕對位置定位
    // g 為群組 tag，所以可以在下面放 tag
    // x、y 絕對位置
    // dx、dy 前一個元素的相對位置
    svg.append('text')
        .attrs({
            dy: -20,
            'text-anchor': 'middle',
        })
        .text('JavaScript');
    svg.append('text')
        .attrs({
            dy: 20,
            'text-anchor': 'middle',
        })
        .text('is lots of fun!');

    // donut 每一片的架構為 g > path
    // 宣告 g，用 .data.enter.append 來產生每一片 g
    var g = svg.selectAll('.arc')
        .data(pie(seedData))
        .enter()
        .append('g')
        .attrs({
            class: 'arc',
        })
        .on('click', function (d, i) {
            console.log(arguments);
        });

    // 在 g 下面各自產生自己的 path，並且將 d 填入，d 的內容為 arc 對 d 產生出來的資料
    var path = g.append('path')
        .attrs({
            d: function (d) {
                return arc(d);
            },
            fill: function (d) {
                return colour(d.data.label);
            },
        });

    // 在 g 下面各自產生自己的 text
    // 要用 arc.centroid 對各自的 d 產生中心點位置
    g.append('text')
        .attrs({
            dy: '.35em',
            'text-anchor': 'middle',
            transform: function (d) {
                return `translate(${arc.centroid(d)})`;
            },
        })
        .text(function (d) {
            return d.data.label;
        });

    g.selectAll('.arc text').call(function (text, width) {
        text.each(function () {
            console.log(d3.select(this));
        });
    }, arcText.range([0, width]));
}
// example_2();


function example_3() {
    var seedData = [
        {
            "name": "iTunes (Media)",
            "usage": 131893248
        },
        {
            "name": "Facebook (Access)",
            "usage": 30865408
        },
        {
            "name": "Google APIs(SSL) (Authentication)",
            "usage": 27033600
        },
        {
            "name": "Lets Encrypt (Authentication)",
            "usage": 4229519
        },
        {
            "name": "HTTP-misc (Access)",
            "usage": 2589696
        },
        {
            "name": "iCloud (Access)",
            "usage": 2504704
        },
        {
            "name": "Yahoo Authentication via SSL (Authentication)",
            "usage": 2185216
        },
        {
            "name": "iTunes (Access)",
            "usage": 1558528
        },
        {
            "name": "Facebook (Authentication)",
            "usage": 907264
        }
    ];

    var app_total_usage = 0;
    seedData.forEach(function (app) {
        app_total_usage += app.usage;
    });

    var lighten = function (color, percent) {
        var num = parseInt(color.substring(1), 16),
            amt = Math.round(2.55 * percent),
            R = (num >> 16) + amt,
            B = (num >> 8 & 0x00FF) + amt,
            G = (num & 0x0000FF) + amt;

        return (0x1000000 + (R < 255 ? R < 1 ? 0 : R : 255) * 0x10000 + (B < 255 ? B < 1 ? 0 : B : 255) * 0x100 + (G < 255 ? G < 1 ? 0 : G : 255)).toString(16).slice(1);
    };


    var width = 600,
        height = 300,
        s_width = 240,
        s_height = 300,
        radius = Math.min(s_width, s_height) / 2;

    var colour = d3.scaleOrdinal(d3.schemeCategory10);

    var arc = d3.arc()
        .innerRadius(radius - 60)
        .outerRadius(radius - 30);
    var arcHover = d3.arc()
        .innerRadius(radius - 60)
        .outerRadius(radius - 20);

    var pie = d3.pie()
        .value(function (d) {
            return d.usage;
        })
        .sort(null);

    var svg = d3.select('#example_3')
        .attr('width', width)
        .attr('height', height)
        .style('max-width', 400)
        .style('display', 'initial')
        .append('svg')
        .attr('width', width)
        .attr('height', height)
        .style('max-width', 400);
    var g = svg.append('g')
        .attr('transform', 'translate(' + radius + ', ' + (radius + 20) + ')');

    var gg = g.selectAll('.arc')
        .data(pie(seedData))
        .enter()
        .append('g')
        .attr('class', 'arc');



    var tooltip = svg.append('g')
        .attr('class', 'traffic_tooltip')
        .attr('pointer-events', 'none')
        .style('opacity', 0);

    tooltip.append('rect')
        // .attr('d', 'M 3.5 0.5 L 133.5 0.5 C 136.5 0.5 136.5 0.5 136.5 3.5 L 136.5 44.5 C 136.5 47.5 136.5 47.5 133.5 47.5 L 3.5 47.5 C 0.5 47.5 0.5 47.5 0.5 44.5 L 0.5 3.5 C 0.5 0.5 0.5 0.5 3.5 0.5')
        .attr('fill', 'rgba(247,247,247,0.85)')
        .attr('stroke', '#0280b3')
        .attr('stroke-width', '1');

    var text = tooltip.append('text')
        .attr('font-size', '12px')

    text.append('tspan')
        .attr('dx', 10)
        .attr('dy', 18)
        .text('Google');

    text.append('tspan')
        .attr('x', 10)
        .attr('dy', '1.5em')
        .text('Application:');

    text.append('tspan')
        .attr('dx', '.5em')
        .attr('font-weight', 600)
        .text('58.65%');

    g.append('text')
        .text('123 MB')
        .attr('y', 6)
        .style('font-size', '20px')
        .style('font-weight', 600)
        .style('fill', 'gold')
        .style('text-anchor', 'middle');

    gg.append('path')
        .attr('d', arc)
        .attr('fill', function (d) {
            return colour(d.data.name);
        })
        .attr('stroke', 'rgba(255, 255, 255, .5)')
        .attr('stroke-width', 2)
        .on('mouseover', function (d, i) {
            d3.select(this)
                .transition()
                .duration(500)
                .attr('d', arcHover)
                .attr('fill', function (d) {
                    return '#' + lighten(colour(d.data.name), 5);
                });
        })
        .on('mouseout', function (d, i) {
            d3.select(this)
                .transition()
                .duration(500)
                .attr('d', arc)
                .attr('fill', function (d) {
                    return colour(d.data.name);
                });

            tooltip.style('opacity', 0);
        })
        .on('mousemove', function (d) {
            var x = radius + d3.mouse(this)[0] - 68;
            var y = radius + d3.mouse(this)[1] + 20 - 60;

            var tspan_list = tooltip.attr('transform', 'translate(' + x + ', ' + y + ')')
                .style('opacity', 1)
                .selectAll('tspan').nodes();

            d3.select(tspan_list[0]).text(d.data.name);
            d3.select(tspan_list[2]).text(((d.data.usage / app_total_usage) * 100).toFixed(2) + '%');

            var length1 = tspan_list[0].getComputedTextLength()
            var length2 = tspan_list[1].getComputedTextLength() + tspan_list[2].getComputedTextLength();
            var width = length1 > length2 ? length1 : length2;

            tooltip.select('rect')
                .attr('width', width + 28)
                .attr('height', 46)
                .attr('stroke', colour(d.data.name));
        })
        .transition()
        .duration(1000)
        .attrTween('d', function (d) {
            var interpolate = d3.interpolate({ startAngle: 0, endAngle: 0 }, d);
            return function (t) {
                return arc(interpolate(t));
            };
        });

    var legend = svg.append('g')
        .attr('class', 'legend')
        .attr('transform', 'translate(250, 42)')
        .selectAll('.legend')
        .data(seedData)
        .enter()
        .append('g')
        .attr('transform', function (d, i, nodes) {
            nodes.length * 22.22
            return 'translate(0, ' + i * 22.22 + ')';
        });

    legend.append('rect')
        .attr('class', 'rect')
        .attr('y', '.15em')
        .attr('width', 15)
        .attr('height', 15)
        .attr('fill', function (d) {
            return colour(d.name);
        })
        .attr('stroke', '#fff')
        .attr('stroke-width', 1);

    legend.append('text')
        .attr('dy', '.98em')
        .attr('dx', '2em')
        .attr('fill', '#fff')
        .text(function (d) {
            return d.name.match(/[^\s]+/)[0];
        });

    legend.append('rect')
        .attr('class', 'legend-item-wrp')
        .attr('width', function (d, i) {
            var g_width = legend.nodes()[i].getBBox().width;

            return g_width;
        })
        .attr('height', 20)
        .attr('fill', 'rgba(0, 0, 0, 0)')
        .on('mouseover', function (d, i) {
            d3.select(legend.nodes()[i]).select('.rect').attr('fill', function (d) {
                return '#' + lighten(colour(d.name), 5);
            });

            d3.select(gg.nodes()[i])
                .select('path')
                .transition()
                .duration(500)
                .attr('d', arcHover)
                .attr('fill', function (d) {
                    var x = radius + arc.centroid(d)[0] - 68;
                    var y = radius + arc.centroid(d)[1] + 20 - 60;

                    var tspan_list = tooltip.attr('transform', 'translate(' + x + ', ' + y + ')')
                        .style('opacity', 1)
                        .selectAll('tspan').nodes();

                    d3.select(tspan_list[0]).text(d.data.name);
                    d3.select(tspan_list[2]).text(((d.data.usage / app_total_usage) * 100).toFixed(2) + '%');

                    var length1 = tspan_list[0].getComputedTextLength()
                    var length2 = tspan_list[1].getComputedTextLength() + tspan_list[2].getComputedTextLength();
                    var width = length1 > length2 ? length1 : length2;

                    tooltip.select('rect')
                        .attr('width', width + 28)
                        .attr('height', 46)
                        .attr('stroke', colour(d.data.name));
                    return '#' + lighten(colour(d.data.name), 5);
                });
        })
        .on('mouseout', function (d, i) {
            d3.select(legend.nodes()[i]).select('.rect').attr('fill', function (d) {
                return colour(d.name);
            });

            d3.select(gg.nodes()[i])
                .select('path')
                .transition()
                .duration(500)
                .attr('d', arc)
                .attr('fill', function (d) {
                    return '#' + lighten(colour(d.data.name), 5);
                });
        });

    svg.select('.legend')
        .attr('transform', function (d) {
            var y = (height / 2) - (this.getBBox().height / 2) - 8;
            return 'translate(250, ' + y + ')';
        });
}
example_3();

function example_4() {
    var data = [
        { name: 'iPad 2', value: 0.1, pct: '1%' },
        { name: 'iPad 3', value: 0.5, pct: '1%' },
        { name: 'iPad 4', value: 0.8, pct: '1%' },
        { name: 'iPad Air', value: 15.92, pct: '1%' },
        { name: 'iPad Air 2', value: 43.71, pct: '1%' },
        { name: 'iPad Mini 1', value: 5.83, pct: '1%' },
        { name: 'iPad Mini 2', value: 19, pct: '1%' },
        { name: 'iPad Mini 3', value: 14, pct: '1%' },
        { name: 'iPad Mini 4', value: 14, pct: '1%' },
        { name: 'iPad Mini 5', value: 14, pct: '1%' },
        { name: 'iPad Mini 6', value: 14, pct: '1%' },
        { name: 'iPad Mini 7', value: 14, pct: '1%' },
        { name: 'iPad Mini 8', value: 14, pct: '1%' },
        { name: 'iPad Mini 9', value: 14, pct: '1%' },
        { name: 'iPad Mini 10', value: 14, pct: '1%' },
    ];

    data.sort(function (a, b) {
        return b.value - a.value;
    });

    var svg = d3.select('#example_4').style('display', 'initial').select('svg'),
        canvas = d3.select('#canvas'),
        art = d3.select('#art'),
        labels = d3.select('#labels');

    var d3Pie = d3.pie();
    d3Pie.value(function (d) {
        return d.value;
    });

    // store our chart dimensions
    var cDim = {
        height: 500,
        width: 700,
        innerRadius: 100,
        outerRadius: 150,
        labelRadius: 180
    };

    svg.attrs({
        height: cDim.height,
        width: cDim.width
    })
        .style('display', 'initial');

    canvas.attr('transform', 'translate(' + (cDim.width / 2) + ', ' + (cDim.height / 2) + ')');

    var pieData = d3Pie(data);

    var pieArc = d3.arc()
        .innerRadius(cDim.innerRadius)
        .outerRadius(cDim.outerRadius);


    var colors = d3.scaleOrdinal(d3.schemeCategory20);

    var enteringArcs = art.selectAll('.wedge').data(pieData).enter();

    enteringArcs.append('path')
        .attr('class', 'wedge')
        .attr('d', pieArc)
        .style('fill', function (d, i) { return colors(i); });



    var enteringLabels = labels.selectAll('.label').data(pieData).enter();
    var labelGroups = enteringLabels.append('g').attr('class', 'label');

    var lines = labelGroups.append('line').attrs({
        x1: function (d, i) {
            return pieArc.centroid(d)[0];
        },
        y1: function (d) {
            return pieArc.centroid(d)[1];
        },
        x2: function (d) {
            var centroid = pieArc.centroid(d),
                midAngle = Math.atan2(centroid[1], centroid[0]);
            return Math.cos(midAngle) * cDim.labelRadius;
        },
        y2: function (d) {
            var centroid = pieArc.centroid(d),
                midAngle = Math.atan2(centroid[1], centroid[0]);
            return Math.sin(midAngle) * cDim.labelRadius;
        },

        'class': 'label-line',
        'stroke': function (d, i) {
            return colors(i);
        }
    });

    var textLabels = labelGroups.append('text').attrs({
        fill: '#fff',
        x: function (d, i) {
            var centroid = pieArc.centroid(d),
                midAngle = Math.atan2(centroid[1], centroid[0]),
                x = Math.cos(midAngle) * cDim.labelRadius,
                sign = x > 0 ? 1 : -1;
            return x + (5 * sign);
        },

        y: function (d, i) {
            var centroid = pieArc.centroid(d),
                midAngle = Math.atan2(centroid[1], centroid[0]),
                y = Math.sin(midAngle) * cDim.labelRadius;
            return y;
        },

        'text-anchor': function (d, i) {
            var centroid = pieArc.centroid(d),
                midAngle = Math.atan2(centroid[1], centroid[0]),
                x = Math.cos(midAngle) * cDim.labelRadius;
            return x > 0 ? 'start' : 'end';
        },

        'class': 'label-text'
    })
        .styles({
            'font-size': '12px',
        })
        .text(function (d) {
            return d.data.name + ' ( ' + d.data.pct + ' ) ';
        })


    // relax the label!
    var alpha = 0.5,
        spacing = 15;

    function relax() {
        var again = false;
        textLabels.each(function (d, i) {
            var a = this,
                da = d3.select(a),
                y1 = da.attr('y');
            textLabels.each(function (d, j) {
                var b = this;
                if (a === b) {
                    return;
                }

                db = d3.select(b);
                if (da.attr('text-anchor') !== db.attr('text-anchor')) {
                    return;
                }

                var y2 = db.attr('y');
                deltaY = y1 - y2;

                if (Math.abs(deltaY) > spacing) {
                    return;
                }

                again = true;
                sign = deltaY > 0 ? 1 : -1;
                var adjust = sign * alpha;
                da.attr('y', +y1 + adjust);
                db.attr('y', +y2 - adjust);
            });
        });

        if (again) {
            var labelElements = textLabels.nodes();
            lines.attr('y2', function (d, i) {
                var labelForLine = d3.select(labelElements[i]);
                return labelForLine.attr('y');
            });
            setTimeout(relax, 20);
        }
    }

    relax();
}
// example_4();