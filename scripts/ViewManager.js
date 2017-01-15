function InteractionView(svg, look) {
	this.svg = svg;
	this.look = look;
	this.trajectories = this.svg.append("g").attr("id", "trajectories");

	/**var line_func = d3.svg.line()
		.x(function(d) { return d.x; })
		.y(function(d) { return d.y; });**/

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
		var t = this.nodes.selectAll("circle").data(vertices, function(v) { return v.id});
		//t.enter()
		//    .append("path")
		//    .attr("d", line_func(path.points))
		//    .style(this.look.traj.style.normal);
		
		t  = t.attr(this.look.node.attr.normal);

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
	this.svg = d3.select("#graph").append("svg") //TODO listen on group?
		.attr("id", "canvas")
		.attrs(this.look.canvas.attr);
		//.styles(this.look.canvas.style);
	
	this.interactionView = new InteractionView(this.svg, this.look);
	this.graphView = new GraphView(this.svg, this.look);

	// this.websocket = new WebSocket("ws://localhost:2000");

	//handle incoming events
	/**this.websocket.onmessage = function(msg) {
		var obj = JSON.parse(msg.data);
		if (obj.type == "graph") {
			self.graphView.enterGraph(obj);
		} else if (obj.type == "polyline") {
			if (obj.is_new) {
				self.interactionView.enterTrajactory(obj);
			} else {
				self.interactionView.updateTrajactory(obj);
			}
		}
	}**/
	
	this.dragcount = 0;
	
	this.normalDrag = function(d, mousePos) {
		console.log("normalDrag");
	}
	
	this.moveCanvasDrag = function(d, mousPos) {
		console.log("moveCanvasDrag");
	}

	this.drag = d3.drag().on("start", function(d,i) {
				console.log("start " + self.dragcount + " " + d3.event.identifier);
				self.dragcount = d3.event.active + 1;
				console.log(self.dragcount);
			})
			.on("drag", function(d,i) {
				console.log("drag " + self.dragcount + " " + d3.event.type);
				if (this.dragcount == 1) {
					normalDrag(d, d3.mouse);
				} else if (this.dragcount == 2) {
					moveCanvasDrag(d, d3.mouse);
				}
			})
			.on("end", function(d,i) {
				this.dragcount = d3.event.active;
			});

		this.svg.call(this.drag);

}
