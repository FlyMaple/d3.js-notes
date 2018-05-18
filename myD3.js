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

    var lighten = function (color, percent) {
        var num = parseInt(color.substring(1), 16),
            amt = Math.round(2.55 * percent),
            R = (num >> 16) + amt,
            B = (num >> 8 & 0x00FF) + amt,
            G = (num & 0x0000FF) + amt;

        return (0x1000000 + (R < 255 ? R < 1 ? 0 : R : 255) * 0x10000 + (B < 255 ? B < 1 ? 0 : B : 255) * 0x100 + (G < 255 ? G < 1 ? 0 : G : 255)).toString(16).slice(1);
    };


    var width = 450,
        height = 450,
        radius = Math.min(width, height) / 2;

    var colour = d3.scaleOrdinal(d3.schemeCategory10);

    var arc = d3.arc()
        .innerRadius(radius - 100)
        .outerRadius(radius - 50);
    var arcHover = d3.arc()
        .innerRadius(radius - 100)
        .outerRadius(radius - 40);

    var pie = d3.pie()
        .value(function (d) {
            return d.usage;
        })
        .sort(null);

    var svg = d3.select('#example_3')
        .style('display', 'initial')
        .attrs({
            width: 900,
            height,
        })
        .append('svg')
        .attrs({
            width: 900,
            height,
        });

    var g = svg.append('g')
        .attrs({
            transform: `translate(${radius}, ${radius})`,
        });

    var gg = g.selectAll('.arc')
        .data(pie(seedData))
        .enter()
        .append('g')
        .attrs({
            class: 'arc',
        });

    gg.append('path')
        .attrs({
            d: arc,
            fill: function (d) {
                return colour(d.data.name);
            },
            stroke: 'rgba(255, 255, 255, .5)',
            'stroke-width': 2,
        })
        .on('mouseover', function (d, i) {
            d3.select(this)
                .transition()
                .duration(500)
                .attrs({
                    d: arcHover,
                    fill: function (d) {
                        return `#${lighten(colour(d.data.name), 5)}`;
                    },
                });
        })
        .on('mouseout', function (d, i) {
            d3.select(this)
                .transition()
                .duration(500)
                .attrs({
                    d: arc,
                    fill: function (d) {
                        return colour(d.data.name);
                    },
                });
        });

    g.append('text')
        .text('230.64 MB')
        .attrs({
            y: 15,
        })
        .styles({
            'font-size': '44px',
            'font-weight': 600,
            'fill': 'gold',
            'text-anchor': 'middle',
        });

    var legend = svg.append('g')
        .attrs({
            transform: `translate(${width + 100}, 85)`,
        })
        .selectAll('.legend')
        .data(seedData)
        .enter()
        .append('g')
        .attrs({
            transform: function (d, i, nodes) {
                return `translate(0, ${i * ((height - 150) / nodes.length)})`;
            },
        })
        .on('mouseover', function (d, i) {
            d3.select(this).select('rect').attrs({
                fill: function (d) {
                    return `#${lighten(colour(d.name), 5)}`;
                },
            });
        })
        .on('mouseout', function (d, i) {
            d3.select(this).select('rect').attrs({
                fill: function (d) {
                    return colour(d.name);
                },
            });
        });

    legend.append('rect')
        .attrs({
            y: '.15em',
            width: 15,
            height: 15,
            fill: function (d) {
                return colour(d.name);
            },
            stroke: '#fff',
            'stroke-width': 1,
        });

    legend.append('text')
        .attrs({
            dy: '.98em',
            dx: '2em',
            fill: '#fff',
        })
        .text(function (d) {
            return d.name.match(/[^\s]+/)[0];
        });
}
example_3();