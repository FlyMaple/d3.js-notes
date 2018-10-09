d3.json('https://raw.githubusercontent.com/FWcloud916/TWcity/master/city.json', function (data) {
	d3.select('body svg').remove();

	var width= 800, height = 9000;
	var svg = d3.select('body').append('svg');
	svg.attr('width', width).attr('height', height);
	var root = d3.hierarchy(data);
	var tree = d3.tree();
	tree.size([height, width])
	// .separation(function (a, b) {
	// 	return a.parent === b.parent ? 100 : 2000
    // });

	tree(root);

	var $nodes = root.descendants();
	var $links = root.descendants().slice(1);

	var nodes = svg.selectAll('.node');
	nodes = nodes.data($nodes).enter().append('g')
	.attr('class', function (d) {
		return 'node' + d.children ? ' node--internal' : ' node--leaf';
	})
	.attr('transform', function (d) {
		return 'translate(' + d.y + ', ' + d.x + ')';
	});

	var nodeCircle = nodes.append('circle');
	nodeCircle.attr('r', 5);

	var nodeText = nodes.append('text');
	nodeText
	.attr('dx', function (d) {
		return d.children ? -8 : 8;
	})
	.attr('dy', 3)
	.attr('text-anchor', function (d) {
		return d.children ? 'end' : 'start' ;
	})
	.text(function (d) {
		return d.data.name;
	});

	var links = svg.selectAll('.link');
	links = links.data($links).enter().append('path')
	.attr('class', 'link')
	.attr('fill', 'none')
	.attr('stroke', '#000')
	.attr('d', function (d) {
        return "M" + d.y + "," + d.x
            + "C" + (d.y + d.parent.y) / 2 + "," + d.x
            + " " + (d.y + d.parent.y) / 2 + "," + d.parent.x
            + " " + d.parent.y + "," + d.parent.x;
    })

// 	console.log($nodes);
	
});