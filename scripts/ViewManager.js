
function InteractionView(svg, look) {
	
	this.svg = svg;
	this.look = look;
	this.trajectories = this.svg.append("g").attr("id", "trajectories");

	this.enterTrajactory= function(path) {
		var self = this;
		var t = this.trajectories.selectAll("path").data([path], function(p) { return p.id; });
		var line_func = d3.svg.line()
						.x(function(d) { return d.x; })
						.y(function(d) { return d.y; });
		t.enter()
			.append("path")
			.attr("d", line_func(path.points))
			.style(this.look.traj.style.normal);
			//.transition("trajSeg").duration(500) 
			//.style(this.look.traj.style.exit); 
	}

	this.updateTrajactory = function(path) {
		//console.log("------------");
		var t = this.trajectories.selectAll("path").data([path], function(p) { return p.id; });
		t.attr("d", line_func(path.points)).style(this.look.traj.style.normal);
	}
}


function GraphView(svg, look) {
	
	this.svg = svg;
	this.look = look;
	this.edges = this.svg.append("g").attr("id", "edges");
	this.nodes = this.svg.append("g").attr("id", "nodes");

	var line_func = d3.line()
		.x(function(d) { return d.x; })
		.y(function(d) { return d.y; });
	
	this.enterGraph = function(graph) {
		this.enterEdges(graph.edges);
		this.enterVertices(graph.vertices);	
	}

	this.enterVertices = function(vertices) {
		var self = this;
		var t = this.nodes.selectAll("circle")
			.data(vertices, function(v) { return v.id})
			.attr(this.look.node.attr.normal);

		var nodes = t.enter()
			.append("circle")
			.attr(this.look.node.attr.init)
			.style(this.look.node.style.init)
			.transition("nodes").duration(150)
			.attr(this.look.node.attr.normal)
			.style(this.look.node.style.normal);
	}

	this.enterEdges = function(edges) {
		var self = this;
		var t = this.edges.selectAll("path").data(edges, function(e) { return e.id});
		//t.enter()
		//    .append("path")
		//    .attr("d", line_func(path.points))
		//    .style(this.look.traj.style.normal);
		t = t.attr(this.look.edge.attr);
		var edges = t.enter()
			.append("path")
			//.attr("d", line_func(path))
			.attr(this.look.edge.attr)
			.style(this.look.edge.style.init)
			.transition("edges").duration(150)
			.style(this.look.edge.style.normal);
	}
}


function ViewManager(look) {
	
	var self = this;
	this.look = look;
	
	this.svg = d3.select("#graph").append("svg")
		.attr("id", "canvas")
		.attrs(this.look.canvas.attr)
		.styles(this.look.canvas.style);
	
	this.interactionView = new InteractionView(this.svg, this.look);
	this.graphView = new GraphView(this.svg, this.look);
	
	this.dragcount = 0;
	
	this.singleDrag = function(d, mousePos) {
		console.log("singleDrag");
	}
	
	this.doubleDrag = function(d, mousPos) {
		console.log("doubleDrag");
	}

	this.drag = d3.drag()
	
			.filter(function() {
				// maybe this is useful?
				return !d3.event.button; // default
				// ignores mousedown events on secondary buttons
				// events that don't pass the filter shouldn't create a drag behavior
			})
	
			.on("start", function(d,i) {
				console.log("start " + d3.event.identifier);
				self.dragcount = d3.event.active + 1; // d3.event has exposes several useful fields...
			})
			
			.on("drag", function(d,i) {
				console.log("drag " + d3.event.type);
				if (self.dragcount == 1) {
					self.singleDrag(d, d3.mouse);
				} else if (self.dragcount == 2) {
					self.doubleDrag(d, d3.mouse);
				}
			})
			
			.on("end", function(d,i) {
				this.dragcount = d3.event.active;
			});

		this.svg.call(this.drag);
}
